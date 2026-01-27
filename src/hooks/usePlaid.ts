import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfWeek, eachWeekOfInterval, parseISO } from "date-fns";

export interface IncomeSummary {
  weekly_average: number;
  monthly_average: number;
  total_90_days: number;
  platform_breakdown: Array<{
    name: string;
    total: number;
    percentage: number;
  }>;
  consistency_score: number;
  period_start: string;
  period_end: string;
  iso_currency_code: string;
  updated_at: string;
}

export interface PlaidItem {
  id: string;
  institution_name: string | null;
  created_at: string;
}

export const usePlaidItems = () => {
  return useQuery({
    queryKey: ["plaid-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plaid_items")
        .select("id, institution_name, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching plaid_items:", error);
        // Handle table not found (404) gracefully
        if (error.code === "PGRST116" || error.message.includes("relation") || error.message.includes("does not exist")) {
          return [] as PlaidItem[];
        }
        throw error;
      }
      console.log("Fetched plaid_items:", data?.length || 0, "rows");
      return (data || []) as PlaidItem[];
    },
    retry: false, // Don't retry on 404 errors
  });
};

export const useIncomeSummary = () => {
  return useQuery({
    queryKey: ["income-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income_summaries")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching income_summaries:", error);
        // Handle table not found (404) gracefully
        if (error.code === "PGRST116" || error.message.includes("relation") || error.message.includes("does not exist")) {
          return null;
        }
        throw error;
      }
      console.log("Fetched income_summary:", data ? "Found" : "Empty");
      if (!data) return null;

      return {
        weekly_average: Number(data.weekly_average) || 0,
        monthly_average: Number(data.monthly_average) || 0,
        total_90_days: Number(data.total_90_days) || 0,
        platform_breakdown: (data.platform_breakdown as unknown as IncomeSummary["platform_breakdown"]) || [],
        consistency_score: data.consistency_score || 0,
        period_start: data.period_start || "",
        period_end: data.period_end || "",
        iso_currency_code: data.iso_currency_code || "USD",
        updated_at: data.updated_at || data.created_at || "",
      } as IncomeSummary;
    },
    retry: false, // Don't retry on 404 errors
  });
};

export const useRefreshTransactions = () => {
  const refreshTransactions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const response = await supabase.functions.invoke("plaid-get-transactions", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (response.error) throw response.error;
    return response.data;
  };

  return { refreshTransactions };
};

export interface WeeklyIncomeData {
  date: string;
  amount: number;
}

export const useWeeklyIncomeData = (periodStart?: string, periodEnd?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weekly-income", user?.id, periodStart, periodEnd],
    queryFn: async () => {
      if (!user?.id) return [];

      // Determine date range - default to last 90 days if not provided
      const endDate = periodEnd ? parseISO(periodEnd) : new Date();
      const startDate = periodStart
        ? parseISO(periodStart)
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

      // Fetch all gig income transactions in the period
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("date, amount")
        .eq("user_id", user.id)
        .eq("is_gig_income", true)
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"))
        .order("date", { ascending: true });

      if (error) throw error;
      if (!transactions || transactions.length === 0) return [];

      // Generate all weeks in the interval
      const weekStarts = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 } // Monday
      );

      // Group transactions by week
      const weeklyData: Record<string, number> = {};

      // Initialize all weeks with 0
      weekStarts.forEach((weekStart) => {
        const weekKey = format(weekStart, "yyyy-MM-dd");
        weeklyData[weekKey] = 0;
      });

      // Sum transactions by week
      transactions.forEach((tx) => {
        const txDate = parseISO(tx.date);
        const weekStart = startOfWeek(txDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, "yyyy-MM-dd");

        if (weeklyData[weekKey] !== undefined) {
          weeklyData[weekKey] += Number(tx.amount) || 0;
        }
      });

      // Convert to array format expected by chart
      const chartData: WeeklyIncomeData[] = weekStarts.map((weekStart) => {
        const weekKey = format(weekStart, "yyyy-MM-dd");
        return {
          date: format(weekStart, "MMM d"),
          amount: Math.round(weeklyData[weekKey] * 100) / 100, // Round to 2 decimals
        };
      });

      return chartData;
    },
    enabled: !!user?.id,
  });
};
