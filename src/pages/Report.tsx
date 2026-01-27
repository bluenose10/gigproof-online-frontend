import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIncomeSummary } from "@/hooks/usePlaid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Loader2,
  Crown,
  Lock,
  Shield,
  TrendingUp,
  DollarSign,
  Wallet,
  CheckCircle,
  Building2,
  Wifi,
  Mail,
  Calendar,
  Hash,
  FileText,
  List,
  Eye,
  Clock,
  Trash2,
} from "lucide-react";
import { generateIncomeReport, downloadPdf } from "@/lib/generatePdf";
import { toast } from "sonner";

const Report = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useIncomeSummary();
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "list">("preview");

  // During beta, treat all reports as premium-style (no watermark, full layout)
  const isPremium = true;

  // Fetch all reports for this user
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ["reports", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, pdf_credits")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const pdfCredits = profile?.pdf_credits ?? 0;

  const formatCurrency = (amount: number, currencyOverride?: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyOverride || (summary as any)?.iso_currency_code || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownload = async () => {
    if (!summary) {
      toast.error("No income data available");
      return;
    }

    // Check if user has credits
    if (pdfCredits <= 0) {
      toast.error("No PDF credits remaining. Please purchase more credits.");
      navigate("/pricing");
      return;
    }

    setDownloading(true);
    try {
      // SECURITY: Call server to create report with SERVER-STORED authoritative data
      // The server fetches income_summaries (computed from Plaid transactions) and creates the report
      // Users cannot insert/update reports directly (RLS blocks them)
      const { data: reportData, error: reportError } = await supabase.functions.invoke('create-report');

      if (reportError || !reportData) {
        console.error("Error creating report:", reportError);
        toast.error(reportError?.message || "Failed to create report. Please try again.");
        setDownloading(false);
        return;
      }

      const { reportId, verificationCode, userInfo, summary: serverSummary } = reportData;

      // Generate PDF using SERVER-PROVIDED data (not local state)
      // Even if a user modifies the PDF, the lender will see the real server-stored numbers
      const doc = generateIncomeReport(serverSummary, userInfo, isPremium, verificationCode);

      // Download PDF
      const filename = isPremium
        ? `gigproof-premium-report-${reportId}.pdf`
        : `gigproof-report-${reportId}.pdf`;
      downloadPdf(doc, filename);

      // Deduct one credit using RPC (atomic operation)
      const { error: creditError } = await supabase.rpc('use_pdf_credit');

      if (creditError) {
        console.error("Error deducting credit:", creditError);
        toast.warning("PDF downloaded but credit not deducted. Please contact support.");
      } else {
        toast.success(`Report downloaded! ${pdfCredits - 1} ${pdfCredits - 1 === 1 ? 'credit' : 'credits'} remaining`);
        refetchProfile();
      }

      // Refresh reports list
      refetchReports();
      setViewMode("list");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleRegenerateReport = async (report: any) => {
    if (!summary) {
      toast.error("No income data available");
      return;
    }

    setDownloading(true);
    try {
      const userInfo = {
        fullName: profile?.full_name || user?.email?.split("@")[0] || "User",
        email: profile?.email || user?.email || "",
      };

      // Use the stored report data or current summary
      const reportSummary = {
        weekly_average: report.weekly_average || summary.weekly_average,
        monthly_average: report.monthly_average || summary.monthly_average,
        total_90_days: report.total_90_days || summary.total_90_days,
        platform_breakdown: report.platform_breakdown || summary.platform_breakdown,
        consistency_score: report.consistency_score || summary.consistency_score,
        period_start: report.period_start || summary.period_start,
        period_end: report.period_end || summary.period_end,
        iso_currency_code: report.iso_currency_code || summary.iso_currency_code,
      };

      // Use stored verification code or fallback to report_id if not available (for old reports)
      const verificationCode = report.verification_code || report.report_id;

      const doc = generateIncomeReport(reportSummary, userInfo, report.is_premium, verificationCode);
      const filename = report.is_premium
        ? `gigproof-premium-report-${report.report_id}.pdf`
        : `gigproof-sample-report-${report.report_id}.pdf`;
      downloadPdf(doc, filename);
      toast.success("Report downloaded!");
    } catch (error) {
      console.error("Error regenerating PDF:", error);
      toast.error("Failed to regenerate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this report from your history?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Report deleted");
      refetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    }
  };

  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const periodStart = summary?.period_start
    ? new Date(summary.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const periodEnd = summary?.period_end
    ? new Date(summary.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const periodText = `${periodStart} - ${periodEnd}`;
  // Report ID will be generated when downloading

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-primary";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const platforms = summary?.platform_breakdown || [];
  const total = platforms.reduce((sum, p) => sum + p.total, 0);
  const score = summary?.consistency_score || 0;

  const findings = [
    { text: "Regular income deposits detected", positive: score >= 60 },
    { text: "Multiple verified income sources", positive: platforms.length > 1 },
    { text: "Consistent weekly earning patterns", positive: score >= 70 },
    { text: "Bank account verification complete", positive: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 md:py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {/* Credits Display */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800">
                {pdfCredits} {pdfCredits === 1 ? 'Credit' : 'Credits'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={viewMode === "preview" ? "default" : "outline"}
              onClick={() => setViewMode("preview")}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              size="sm"
            >
              <List className="h-4 w-4 mr-2" />
              Reports ({reports?.length || 0})
            </Button>
            {pdfCredits <= 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/pricing")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Crown className="h-4 w-4 mr-2" />
                Buy More Credits
              </Button>
            )}
            <Button
              onClick={handleDownload}
              disabled={downloading || !summary || pdfCredits <= 0}
              className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : pdfCredits <= 0 ? (
                <Lock className="h-4 w-4 mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {pdfCredits <= 0 ? "No Credits" : "Download PDF"}
            </Button>
          </div>
        </div>

        {/* Reports List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Generated Reports
              </h2>
              {reportsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map((report: any) => {
                    const reportDate = new Date(report.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                    const periodStart = report.period_start
                      ? new Date(report.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "N/A";
                    const periodEnd = report.period_end
                      ? new Date(report.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "N/A";

                    return (
                      <div
                        key={report.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-gray-800">Report {report.report_id}</span>
                              {report.is_premium && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  <Crown className="h-3 w-3" />
                                  Premium
                                </span>
                              )}
                              {!report.is_premium && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                  <Lock className="h-3 w-3" />
                                  Sample
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{reportDate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{periodStart} - {periodEnd}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Monthly Avg:</span>{" "}
                                <span className="font-semibold text-gray-800">
                                  {formatCurrency(report.monthly_average || 0, (report as any).iso_currency_code)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Score:</span>{" "}
                                <span className="font-semibold text-gray-800">
                                  {report.consistency_score || 0}%
                                </span>
                              </div>
                              <div className="mt-2 text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block">
                                VERIFY-ID: {report.report_id}-{(report.total_income || 0).toString(16).toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => handleRegenerateReport(report)}
                              disabled={downloading}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              onClick={() => handleDeleteReport(report.id)}
                              disabled={downloading}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Report"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No reports generated yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate your first report to see it here
                  </p>
                  <Button
                    onClick={() => {
                      setViewMode("preview");
                      handleDownload();
                    }}
                    variant="outline"
                  >
                    Generate Report
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview View */}
        {viewMode === "preview" && (
          <>
            {/* Report Preview Container */}
            <div className="relative">
              {/* Report Preview */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

                {/* ========== PAGE 1 ========== */}
                <div className="border-b-4 border-gray-200">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/90 px-6 md:px-8 py-5 md:py-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold tracking-tight">GigProof</span>
                      </div>
                      <h1 className="text-base md:text-lg font-medium hidden md:block">Income Verification Report</h1>
                      <div className="text-right">
                        <div className="text-xs opacity-80">Generated</div>
                        <div className="text-sm font-medium">{reportDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Information */}
                  <div className="p-6 md:p-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      Applicant Information
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wide">Full Name</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {profile?.full_name || user?.email?.split("@")[0] || "Not provided"}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wide">Email</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {profile?.email || user?.email || "Not provided"}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wide">Report Period</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{periodText}</div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wide">Report ID</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800 font-mono">
                          Preview
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Income Summary */}
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      Income Summary
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 md:p-6">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <TrendingUp className="h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-wide">Weekly Average</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {formatCurrency(summary?.weekly_average || 0)}
                        </span>
                      </div>
                      <div className="rounded-xl border-2 border-primary bg-primary/10 p-5 md:p-6 shadow-sm">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <DollarSign className="h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-wide">Monthly Average</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {formatCurrency(summary?.monthly_average || 0)}
                        </span>
                      </div>
                      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5 md:p-6">
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Wallet className="h-5 w-5" />
                          <span className="text-xs font-bold uppercase tracking-wide">Total (90 Days)</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {formatCurrency(summary?.total_90_days || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Page 1 Footer */}
                  <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          Bank-Verified
                        </span>
                        <span className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          Plaid Connected
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          256-bit SSL
                        </span>
                      </div>
                      <span className="font-medium">Page 1 of 2</span>
                    </div>
                    {isPremium && (
                      <div className="text-center mt-2 text-xs text-primary font-semibold">
                        ✓ Verified GigProof Premium Report
                      </div>
                    )}
                  </div>
                </div>

                {/* ========== PAGE 2 ========== */}
                <div>
                  {/* Mini Header for Page 2 */}
                  <div className="bg-primary px-6 md:px-8 py-3 flex items-center justify-between text-white text-sm">
                    <span className="font-bold">GigProof</span>
                    <span className="hidden md:block">Income Verification Report</span>
                    <span className="text-xs md:text-sm">{reportDate}</span>
                  </div>

                  {/* Income by Platform */}
                  <div className="p-6 md:p-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      Income by Platform
                    </h2>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 text-sm font-semibold">Platform</th>
                            <th className="text-right px-4 py-3 text-sm font-semibold">Total Income</th>
                            <th className="text-right px-4 py-3 text-sm font-semibold">% of Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {platforms.map((platform, index) => (
                            <tr key={platform.name} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-800">{platform.name}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold text-primary">
                                {formatCurrency(platform.total)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right text-gray-700">
                                {platform.percentage.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-primary/10 border-t-2 border-primary/20">
                            <td className="px-4 py-3 text-sm font-bold text-primary">Total</td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-primary">
                              {formatCurrency(total)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-primary">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Consistency Analysis */}
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      Income Consistency Analysis
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Score Circle */}
                      <div className="flex-shrink-0 flex justify-center">
                        <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${getScoreColor(score)} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                          <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white">{score}%</div>
                            <div className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Score</div>
                          </div>
                        </div>
                      </div>
                      {/* Key Findings */}
                      <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-5">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Key Findings</h3>
                        <div className="space-y-3">
                          {findings.map((finding, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <CheckCircle
                                className={`h-5 w-5 flex-shrink-0 ${finding.positive ? "text-primary" : "text-gray-400"}`}
                              />
                              <span className={`text-sm ${finding.positive ? "text-gray-700" : "text-gray-500"}`}>
                                {finding.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page 2 Footer */}
                  <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          Bank-Verified
                        </span>
                        <span className="flex items-center gap-1">
                          <Wifi className="h-3 w-3" />
                          Plaid Connected
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          256-bit SSL
                        </span>
                      </div>
                      <span className="font-medium">Page 2 of 2</span>
                    </div>
                    {isPremium && (
                      <div className="text-center mt-2 text-xs text-primary font-semibold">
                        ✓ Verified GigProof Premium Report
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Report;
