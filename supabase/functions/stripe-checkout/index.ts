const getCorsHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-requested-with",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
});

const getSupabaseHeaders = (serviceRoleKey: string) => ({
    "Authorization": `Bearer ${serviceRoleKey}`,
    "apikey": serviceRoleKey,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
});

Deno.serve(async (req) => {
    console.log("🔵 Function invoked, method:", req.method);
    const corsHeaders = getCorsHeaders();

    if (req.method === "OPTIONS") {
        console.log("✅ OPTIONS request handled");
        return new Response("ok", { headers: corsHeaders });
    }

    console.log("🟢 Processing POST request");
    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

        // Parse request body
        let body;
        try {
            const rawBody = await req.text();
            console.log("Raw body text:", rawBody);
            body = JSON.parse(rawBody);
            console.log("Parsed body:", body);
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return new Response(
                JSON.stringify({ error: "Invalid JSON in request body" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const { priceId, planType, userId } = body;
        console.log("Request received:", { priceId, planType, userId });

        if (!priceId || !planType || !userId) {
            console.error("Missing params:", { priceId, planType, userId });
            return new Response(
                JSON.stringify({ error: "Missing required parameters" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get user profile
        const profileRes = await fetch(
            `${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}&select=stripe_customer_id,email,full_name`,
            { headers: getSupabaseHeaders(serviceRoleKey) }
        );

        if (!profileRes.ok) {
            const error = await profileRes.text();
            console.error("Profile fetch error:", error);
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const profileList = await profileRes.json();
        const profile = profileList?.[0];

        if (!profile) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log("Profile found:", profile.email);

        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        let customerId = profile?.stripe_customer_id;

        // Create Stripe customer if doesn't exist
        if (!customerId) {
            console.log("Creating Stripe customer...");

            const customerResponse = await fetch("https://api.stripe.com/v1/customers", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${stripeKey}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    email: profile.email || "",
                    name: profile.full_name || "",
                    "metadata[supabase_user_id]": userId,
                }),
            });

            if (!customerResponse.ok) {
                const error = await customerResponse.text();
                console.error("Stripe customer error:", error);
                throw new Error("Failed to create Stripe customer");
            }

            const customer = await customerResponse.json();
            customerId = customer.id;

            console.log("Customer created:", customerId);

            // Save customer ID
            const updateRes = await fetch(
                `${supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}`,
                {
                    method: "PATCH",
                    headers: getSupabaseHeaders(serviceRoleKey),
                    body: JSON.stringify({ stripe_customer_id: customerId })
                }
            );

            if (!updateRes.ok) {
                const error = await updateRes.text();
                console.error("Failed to update customer ID:", error);
            }
        }

        const origin = req.headers.get("origin") || "https://gigproof.online";

        console.log("Creating checkout session...");

        // Create Stripe checkout session (all purchases are one-time payments now)
        const sessionResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${stripeKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                customer: customerId,
                "line_items[0][price]": priceId,
                "line_items[0][quantity]": "1",
                mode: "payment", // Always one-time payment
                success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/pricing`,
                "metadata[supabase_user_id]": userId,
                "metadata[plan_type]": planType,
            }),
        });

        if (!sessionResponse.ok) {
            const error = await sessionResponse.json();
            console.error("Stripe session error:", error);
            throw new Error(error.error?.message || "Failed to create checkout session");
        }

        const session = await sessionResponse.json();
        console.log("✅ SUCCESS! Checkout session created:", session.id);

        return new Response(
            JSON.stringify({ url: session.url }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("❌ Error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
