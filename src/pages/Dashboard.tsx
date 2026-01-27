import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlaidItems, useIncomeSummary } from "@/hooks/usePlaid";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import PlaidLinkButton from "@/components/PlaidLinkButton";
import {
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  TrendingUp,
  Calendar,
  PieChart,
  ChevronRight,
  Shield,
  RefreshCw,
  Loader2,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PLATFORM_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-accent",
  "bg-foreground",
  "bg-secondary",
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: plaidItems, isLoading: loadingItems } = usePlaidItems();
  const { data: incomeSummary, isLoading: loadingSummary } = useIncomeSummary();

  // Fetch user profile for full name, create if missing (for OAuth users)
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        // Try to fetch existing profile with PDF credits
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, email, pdf_credits, stripe_customer_id")
          .eq("id", user.id)
          .maybeSingle();

        // If profile doesn't exist (404 or not found), create it
        if (error && (error.code === "PGRST116" || error.message.includes("No rows") || error.message.includes("does not exist"))) {
          console.log("Profile not found, creating for OAuth user...");
          const { ensureProfileExists } = await import("@/lib/profileUtils");
          try {
            const { profile: newProfile } = await ensureProfileExists(user);
            return newProfile;
          } catch (createError) {
            console.error("Failed to create profile:", createError);
            // Return fallback data instead of throwing
            return {
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
              email: user.email || "",
            };
          }
        }

        // Handle 400 errors (bad request - might be table doesn't exist or RLS issue)
        if (error && (error.code === "PGRST301")) {
          console.warn("Profile query returned 400, using fallback data:", error);
          return {
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || "",
          };
        }

        if (error) {
          console.error("Error fetching profile:", error);
          // Don't throw, return fallback
          return {
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || "",
          };
        }

        return data;
      } catch (err) {
        console.error("Unexpected error in profile query:", err);
        // Always return fallback instead of throwing
        return {
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
        };
      }
    },
    enabled: !!user?.id,
    retry: false, // Don't retry to avoid spam
  });

  const bankConnected = (plaidItems?.length ?? 0) > 0;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleBankConnected = () => {
    queryClient.invalidateQueries({ queryKey: ["plaid-items"] });
    queryClient.invalidateQueries({ queryKey: ["income-summary"] });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in first");
        return;
      }

      await supabase.functions.invoke("plaid-get-transactions", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      queryClient.invalidateQueries({ queryKey: ["income-summary"] });
      toast.success("Transactions refreshed!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh transactions");
    } finally {
      setRefreshing(false);
    }
  };

  const userEmail = user?.email || "User";
  const fullName = profile?.full_name || user?.user_metadata?.full_name || userEmail.split("@")[0];
  // Extract first name only
  const userName = fullName.split(" ")[0];

  // Get PDF credits info
  const pdfCredits = profile?.pdf_credits ?? 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (incomeSummary as any)?.iso_currency_code || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sidebarLinks = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
    { name: "Reports", icon: FileText, href: "/report" },
    { name: "Pricing", icon: CreditCard, href: "/pricing" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const isLoading = loadingItems || loadingSummary;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GigProof</span>
            </Link>
            <button
              className="rounded-md p-1 hover:bg-muted lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${link.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <button
            className="rounded-md p-2 hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold">Dashboard</span>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {/* Page header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  Welcome back, {userName} 👋
                </h1>
                {pdfCredits > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    {pdfCredits} {pdfCredits === 1 ? "Credit" : "Credits"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">
                Here's your income summary and latest activity
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Button
                variant="default"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2 font-semibold">Sync Bank Data</span>
              </Button>
              {incomeSummary?.updated_at && (
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  Last synced: {new Date(incomeSummary.updated_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !bankConnected ? (
            /* Not Connected State */
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                <Building2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Connect Your Bank Account
              </h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                Securely link your bank to start tracking your gig income. We'll automatically detect payments from Uber, DoorDash, Lyft, and more.
              </p>
              <PlaidLinkButton onSuccess={handleBankConnected} />
              <p className="mt-4 text-xs text-muted-foreground">
                Powered by Plaid • Bank-level encryption
              </p>
            </div>
          ) : (
            /* Connected State */
            <div className="space-y-6">
              {plaidItems && plaidItems.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Connected: {Array.from(new Set(plaidItems.map(item => item.institution_name || "Bank Account"))).join(", ")}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Average</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(incomeSummary?.weekly_average ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last 90 Days</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(incomeSummary?.total_90_days ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <PieChart className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Platforms</p>
                      <p className="text-2xl font-bold text-foreground">
                        {incomeSummary?.platform_breakdown?.length ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Consistency</p>
                      <p className="text-2xl font-bold text-foreground">
                        {incomeSummary?.consistency_score ?? 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Trust Banner */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-6 shadow-sm overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 justify-center md:justify-start">
                      Enterprise Trust Security
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase tracking-tighter">Verified</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                      GigProof delivers bank-originated data captured directly from financial institutions via encrypted APIs.
                      Every report includes a unique verification code for instant authenticity checks at gigproof.online/verify.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Infrastructure</div>
                      <div className="text-xs font-semibold text-foreground">SOC 2 Type II</div>
                    </div>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Encryption</div>
                      <div className="text-xs font-semibold text-foreground">256-bit AES</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart and Breakdown */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Monthly Average Card */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
                  <h3 className="mb-6 text-lg font-semibold text-foreground">
                    Income Summary
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Monthly Average</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">
                        {formatCurrency(incomeSummary?.monthly_average ?? 0)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Period</p>
                      <p className="mt-1 text-lg font-medium text-foreground">
                        {incomeSummary?.period_start && incomeSummary?.period_end
                          ? `${new Date(incomeSummary.period_start).toLocaleDateString()} - ${new Date(incomeSummary.period_end).toLocaleDateString()}`
                          : "Last 90 days"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Breakdown */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h3 className="mb-6 text-lg font-semibold text-foreground">
                    Platform Breakdown
                  </h3>
                  {incomeSummary?.platform_breakdown && incomeSummary.platform_breakdown.length > 0 ? (
                    <div className="space-y-4">
                      {incomeSummary.platform_breakdown.map((platform, index) => (
                        <div key={platform.name}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-foreground">{platform.name}</span>
                            <span className="font-medium text-foreground">
                              {platform.percentage}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full ${PLATFORM_COLORS[index % PLATFORM_COLORS.length]} transition-all`}
                              style={{ width: `${platform.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No gig income detected yet. Make sure your bank is connected and transactions have been synced.
                    </p>
                  )}

                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Income consistency score
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${(incomeSummary?.consistency_score ?? 0) >= 70 ? "text-success" : (incomeSummary?.consistency_score ?? 0) >= 40 ? "text-accent" : "text-destructive"}`}>
                      {incomeSummary?.consistency_score ?? 0}%
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(incomeSummary?.consistency_score ?? 0) >= 70
                        ? "Excellent - lenders love this"
                        : (incomeSummary?.consistency_score ?? 0) >= 40
                          ? "Good - room for improvement"
                          : "Needs improvement"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:flex-row">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ready to download your report?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a professional PDF you can submit to any lender or landlord
                  </p>
                </div>
                <Link to="/report">
                  <Button variant="hero" size="lg">
                    Generate Latest Report
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
