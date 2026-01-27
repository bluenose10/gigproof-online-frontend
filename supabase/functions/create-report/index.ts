import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize service client for database operations
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await serviceClient.auth.getUser(token);

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Creating report for user: ${user.id}`);

    // Fetch SERVER-STORED authoritative income summary
    // This is the canonical source of truth computed from Plaid transactions
    const { data: incomeSummary, error: summaryError } = await serviceClient
      .from("income_summaries")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (summaryError || !incomeSummary) {
      console.error("Income summary error:", summaryError);
      return new Response(
        JSON.stringify({ error: "No income data found. Please sync your bank first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch user profile for name/email and credit check
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("full_name, email, pdf_credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check PDF credits
    if ((profile.pdf_credits || 0) <= 0) {
      return new Response(
        JSON.stringify({ error: "Insufficient PDF credits. Please purchase more credits." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate cryptographically secure verification code (64-bit entropy)
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const verificationCode = `GIGI-${Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;

    const reportId = `GIG-${Date.now().toString(36).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days

    // Create tamper-evident hash of the canonical report data
    const canonicalData = JSON.stringify({
      total: incomeSummary.total_90_days,
      monthly: incomeSummary.monthly_average,
      weekly: incomeSummary.weekly_average,
      code: verificationCode,
    });
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(canonicalData));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const verificationHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // SERVER creates the report record with authoritative data
    // Users cannot insert/update this table (RLS blocks them)
    const { error: insertError } = await serviceClient
      .from("reports")
      .insert({
        user_id: user.id,
        report_id: reportId,
        verification_code: verificationCode,
        verification_hash: verificationHash,
        expires_at: expiresAt,
        is_premium: true,
        period_start: incomeSummary.period_start,
        period_end: incomeSummary.period_end,
        weekly_average: incomeSummary.weekly_average,
        monthly_average: incomeSummary.monthly_average,
        total_90_days: incomeSummary.total_90_days,
        consistency_score: incomeSummary.consistency_score,
        platform_breakdown: incomeSummary.platform_breakdown,
        iso_currency_code: incomeSummary.iso_currency_code || 'USD',
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create report. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Report created successfully: ${verificationCode}`);

    // Return canonical data for client-side PDF generation
    // Even though PDF is generated client-side, the authoritative data is server-controlled
    return new Response(
      JSON.stringify({
        reportId,
        verificationCode,
        expiresAt,
        userInfo: {
          fullName: profile.full_name || user.email?.split("@")[0] || "User",
          email: profile.email || user.email || "",
        },
        summary: {
          weekly_average: Number(incomeSummary.weekly_average),
          monthly_average: Number(incomeSummary.monthly_average),
          total_90_days: Number(incomeSummary.total_90_days),
          platform_breakdown: incomeSummary.platform_breakdown,
          consistency_score: incomeSummary.consistency_score,
          period_start: incomeSummary.period_start,
          period_end: incomeSummary.period_end,
          iso_currency_code: incomeSummary.iso_currency_code || 'USD',
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `Internal server error: ${message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
