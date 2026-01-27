/**
 * Profile Utilities
 * 
 * Helper functions for managing user profiles, especially for OAuth users
 * where the trigger might not have fired.
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

/**
 * Ensure a profile exists for the current user
 * Creates one if missing (useful for OAuth users where trigger might not have fired)
 */
export async function ensureProfileExists(user: User): Promise<{ created: boolean; profile: any }> {
  if (!user?.id) {
    throw new Error("User ID is required");
  }

  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found" which is fine, other errors are real problems
    console.error("Error checking profile:", fetchError);
    throw fetchError;
  }

  if (existingProfile) {
    return { created: false, profile: existingProfile };
  }

  // Profile doesn't exist, create it
  const fullName = 
    user.user_metadata?.full_name || 
    user.user_metadata?.name || 
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] || 
    "User";

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email || "",
      full_name: fullName,
    })
    .select("full_name, email")
    .single();

  if (insertError) {
    console.error("Error creating profile:", insertError);
    throw insertError;
  }

  return { created: true, profile: newProfile };
}
