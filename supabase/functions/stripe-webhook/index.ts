import { createClient } from "jsr:@supabase/supabase-js@2";

// Verify Stripe webhook signature manually (no Stripe SDK to avoid Node.js deps)
async function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const parts = signature.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.substring(2);
  const sig = parts.find((p) => p.startsWith("v1="))?.substring(3);

  if (!timestamp || !sig) return false;

  const payload = `${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const expectedSig = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expectedSig === sig;
}

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const body = await req.text();

  // Verify signature
  const isValid = await verifyStripeSignature(body, signature, webhookSecret);

  if (!isValid) {
    console.error("Webhook signature verification failed");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id;
      const planType = session.metadata?.plan_type;

      if (userId) {
        // Determine how many credits to add
        const creditsToAdd = planType === "bundle" ? 10 : 1;

        console.log(`Processing payment for user ${userId}, plan: ${planType}, credits to add: ${creditsToAdd}`);

        // Get current credits
        const { data: profile, error: selectError } = await supabase
          .from("profiles")
          .select("pdf_credits")
          .eq("user_id", userId)
          .single();

        if (selectError) {
          console.error(`Failed to find profile for user ${userId}:`, selectError);
          break;
        }

        const currentCredits = profile?.pdf_credits || 0;
        console.log(`Current credits: ${currentCredits}`);

        // Add credits using RPC to bypass RLS
        const { error: rpcError } = await supabase.rpc("add_pdf_credits", {
          p_user_id: userId,
          p_credits: creditsToAdd,
        });

        if (rpcError) {
          console.error(`RPC add_pdf_credits failed for user ${userId}:`, rpcError);

          // Fallback: try direct update
          const { data: updateData, error: updateError } = await supabase
            .from("profiles")
            .update({
              pdf_credits: currentCredits + creditsToAdd,
            })
            .eq("user_id", userId)
            .select();

          if (updateError) {
            console.error(`Direct update also failed for user ${userId}:`, updateError);
          } else if (!updateData || updateData.length === 0) {
            console.error(`Direct update returned no rows for user ${userId}`);
          } else {
            console.log(`Fallback update succeeded. New total: ${updateData[0].pdf_credits}`);
          }
        } else {
          console.log(`Added ${creditsToAdd} PDF credits to user ${userId} via RPC`);
        }
      } else {
        console.error("No supabase_user_id in session metadata");
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
