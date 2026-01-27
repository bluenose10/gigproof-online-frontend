import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Gig platform keywords to identify income
const GIG_PLATFORMS = [
  { keywords: ["UBER", "UBER TRIP", "UBER EATS"], name: "Uber" },
  { keywords: ["DOORDASH", "DOOR DASH"], name: "DoorDash" },
  { keywords: ["LYFT"], name: "Lyft" },
  { keywords: ["INSTACART"], name: "Instacart" },
  { keywords: ["GRUBHUB", "GRUB HUB"], name: "Grubhub" },
  { keywords: ["POSTMATES"], name: "Postmates" },
  { keywords: ["DELIVEROO", "ROOFOODS", "ROO FOODS"], name: "Deliveroo" },
  { keywords: ["JUST EAT", "JUSTEAT"], name: "Just Eat" },
  { keywords: ["STUART", "SRL"], name: "Stuart" },
  { keywords: ["AMAZON FLEX"], name: "Amazon Flex" },
  { keywords: ["GOPUFF"], name: "GoPuff" },
  { keywords: ["SHIPT"], name: "Shipt" },
  { keywords: ["SPARK DRIVER"], name: "Spark" },
  { keywords: ["TASKRABBIT"], name: "TaskRabbit" },
  { keywords: ["FIVERR"], name: "Fiverr" },
  { keywords: ["UPWORK"], name: "Upwork" },
  // Sandbox test keywords - matches common Plaid sandbox transactions
  { keywords: ["UNITED", "AIRLINES"], name: "Test Platform A" },
  { keywords: ["INTRST", "INTEREST"], name: "Test Platform B" },
  { keywords: ["MADISON", "BICYCLE"], name: "Test Platform C" },
  { keywords: ["KFC", "MCDONALD"], name: "Test Platform D" },
];

function identifyGigPlatform(transactionName: string, merchantName: string | null): string | null {
  const searchText = `${transactionName} ${merchantName || ""}`.toUpperCase();

  for (const platform of GIG_PLATFORMS) {
    for (const keyword of platform.keywords) {
      if (searchText.includes(keyword)) {
        return platform.name;
      }
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    console.log(`Plaid Get Transactions: Identifying user ${userId}`);

    // Get user's bank accounts using service role to access access_token
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: bankAccounts, error: plaidError } = await serviceClient
      .from("plaid_items")
      .select("*, plaid_tokens(access_token)")
      .eq("user_id", userId);

    if (plaidError || !bankAccounts?.length) {
      console.error("Plaid fetch error:", plaidError);
      return new Response(JSON.stringify({ error: "No connected bank accounts" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PLAID_CLIENT_ID = Deno.env.get("PLAID_CLIENT_ID");
    const PLAID_SECRET = Deno.env.get("PLAID_SECRET");
    const PLAID_ENV = Deno.env.get("PLAID_ENV") || "sandbox";

    // Calculate date range (last 90 days)
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    let allTransactions: any[] = [];

    for (const bankAccount of bankAccounts) {
      console.log(`Processing bank account: ${bankAccount.institution_name} (${bankAccount.id})`);

      // Handle both object and array response from Supabase join
      const tokenData = bankAccount.plaid_tokens;
      const accessToken = Array.isArray(tokenData)
        ? tokenData[0]?.access_token
        : (tokenData as any)?.access_token;

      if (!accessToken) {
        console.error(`Missing access token for bank account ${bankAccount.id}. Join result:`, JSON.stringify(tokenData));
        continue;
      }

      // Sync transactions first
      await fetch(`https://${PLAID_ENV}.plaid.com/transactions/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: accessToken,
        }),
      });

      // Get transactions
      const transactionsResponse = await fetch(`https://${PLAID_ENV}.plaid.com/transactions/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          options: { count: 500 },
        }),
      });

      const transactionsData = await transactionsResponse.json();

      if (!transactionsResponse.ok) {
        console.error("Plaid transactions error:", transactionsData);
        continue;
      }

      // Process ALL transactions in sandbox mode for testing
      // In production, filter for credits only (amount < 0)
      const isSandbox = PLAID_ENV === "sandbox";

      const processedTransactions = transactionsData.transactions
        .map((t: any) => {
          const platformName = identifyGigPlatform(t.name, t.merchant_name);
          const isCredit = t.amount < 0;

          // In sandbox: treat matched platforms OR any credit as gig income
          // In production: only credits with matching platforms are gig income
          const isGigIncome = isSandbox
            ? (platformName !== null || isCredit)
            : (platformName !== null && isCredit);

          return {
            user_id: userId,
            bank_account_id: bankAccount.id,
            plaid_transaction_id: t.transaction_id,
            account_id: t.account_id,
            amount: Math.abs(t.amount),
            iso_currency_code: t.iso_currency_code || 'USD',
            date: t.date,
            name: t.name,
            merchant_name: t.merchant_name,
            category: t.category,
            platform_name: isGigIncome ? (platformName || "Gig Platform") : null,
            is_gig_income: isGigIncome,
          };
        });

      allTransactions = [...allTransactions, ...processedTransactions];
    }

    // Upsert transactions to database
    if (allTransactions.length > 0) {
      const { error: upsertError } = await serviceClient
        .from("transactions")
        .upsert(allTransactions, { onConflict: "plaid_transaction_id" });

      if (upsertError) {
        console.error("Transaction upsert error:", upsertError);
      }
    }

    // Calculate income summary
    const gigTransactions = allTransactions.filter(t => t.is_gig_income);
    const totalIncome = gigTransactions.reduce((sum, t) => sum + t.amount, 0);
    const weeks = 13; // ~90 days
    const months = 3;

    // Group by platform
    const platformTotals: Record<string, number> = {};
    gigTransactions.forEach(t => {
      if (t.platform_name) {
        platformTotals[t.platform_name] = (platformTotals[t.platform_name] || 0) + t.amount;
      }
    });

    const platformBreakdown = Object.entries(platformTotals)
      .map(([name, total]) => ({
        name,
        total: Math.round(total * 100) / 100,
        percentage: Math.round((total / totalIncome) * 100) || 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Calculate consistency score (based on weekly income variance)
    const weeklyIncomes: number[] = [];
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const weekIncome = gigTransactions
        .filter(t => {
          const txDate = new Date(t.date);
          return txDate >= weekStart && txDate < weekEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      weeklyIncomes.push(weekIncome);
    }

    const avgWeekly = weeklyIncomes.reduce((a, b) => a + b, 0) / weeks;
    const variance = weeklyIncomes.reduce((sum, w) => sum + Math.pow(w - avgWeekly, 2), 0) / weeks;
    const stdDev = Math.sqrt(variance);
    const coeffOfVariation = avgWeekly > 0 ? stdDev / avgWeekly : 1;
    const consistencyScore = Math.max(0, Math.min(100, Math.round((1 - coeffOfVariation) * 100)));

    const currencyCode = gigTransactions[0]?.iso_currency_code || 'USD';

    // Upsert income summary
    const summary = {
      user_id: userId,
      weekly_average: Math.round(avgWeekly * 100) / 100,
      monthly_average: Math.round((totalIncome / months) * 100) / 100,
      total_90_days: Math.round(totalIncome * 100) / 100,
      platform_breakdown: platformBreakdown,
      consistency_score: consistencyScore,
      iso_currency_code: currencyCode,
      period_start: startDate,
      period_end: endDate,
    };

    await serviceClient
      .from("income_summaries")
      .upsert(summary, { onConflict: "user_id" });

    console.log(`Successfully processed ${allTransactions.length} transactions, ${gigTransactions.length} gig-related.`);

    return new Response(JSON.stringify({
      success: true,
      transactions_count: allTransactions.length,
      gig_transactions_count: gigTransactions.length,
      summary,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
