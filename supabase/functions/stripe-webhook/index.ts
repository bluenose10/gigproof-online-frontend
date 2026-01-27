import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno&no-check";

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

        // Get current credits
        const { data: profile } = await supabase
          .from("profiles")
          .select("pdf_credits")
          .eq("user_id", userId)
          .single();

        const currentCredits = profile?.pdf_credits || 0;

        // Add credits
        await supabase
          .from("profiles")
          .update({
            pdf_credits: currentCredits + creditsToAdd,
          })
          .eq("user_id", userId);

        console.log(`Added ${creditsToAdd} PDF credits to user ${userId}. Total: ${currentCredits + creditsToAdd}`);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
