import { Shield, CheckCircle, FileText, Lock, Building2, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LenderSection = () => {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Building2 className="h-4 w-4" />
              For Lenders & Financial Institutions
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Trusted Income Verification for Gig Workers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              GigProof provides bank-verified income reports that meet lender requirements and help you make
              informed lending decisions for gig economy workers.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Bank-Verified Data</h3>
              <p className="text-sm text-muted-foreground">
                All income data is directly sourced from verified bank transactions via Plaid, a trusted
                financial data provider used by major institutions.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Secure & Compliant</h3>
              <p className="text-sm text-muted-foreground">
                SOC 2 Type II certified infrastructure, 256-bit SSL encryption, and GDPR-compliant data handling
                ensure the highest security standards.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Professional Reports</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive PDF reports include income averages, consistency scores, platform breakdowns,
                and verification statements.
              </p>
            </div>
          </div>

          {/* Why Accept GigProof Reports */}
          <div className="mb-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
            <h3 className="mb-6 text-2xl font-bold text-foreground">Why Accept GigProof Reports?</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Verified Transaction Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Income figures are calculated from actual bank deposits, not self-reported estimates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Consistency Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Reports include consistency scores that help assess income stability and reliability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Platform Breakdown</h4>
                    <p className="text-sm text-muted-foreground">
                      See income sources across multiple gig platforms to understand earning diversity.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Time Period Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      90-day income summaries with weekly and monthly averages for comprehensive assessment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Professional Format</h4>
                    <p className="text-sm text-muted-foreground">
                      Clean, standardized PDF format that's easy to review and integrate into your workflow.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Verification Statement</h4>
                    <p className="text-sm text-muted-foreground">
                      Each premium report includes a verification statement confirming data source and methodology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Verification Process */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-bold text-foreground text-center">Report Verification Process</h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">Bank Connection</h4>
                <p className="text-sm text-muted-foreground">
                  User connects bank account via Plaid
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">Transaction Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  System identifies and categorizes gig income
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">Report Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Professional PDF report created with verification
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground">Lender Review</h4>
                <p className="text-sm text-muted-foreground">
                  You receive verified income documentation
                </p>
              </div>
            </div>
          </div>

          {/* Sample Report Preview */}
          <div className="mb-12 rounded-xl border border-border bg-card p-8 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">Sample Report Preview</h3>
                <p className="text-muted-foreground">
                  See what lenders receive in a GigProof premium report
                </p>
              </div>
              <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Income Summary
                </p>
                <p className="text-2xl font-bold text-foreground">$1,250</p>
                <p className="text-xs text-muted-foreground">Weekly Average</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Consistency Score
                </p>
                <p className="text-2xl font-bold text-foreground">85%</p>
                <p className="text-xs text-muted-foreground">Highly Stable</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Platforms
                </p>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Income Sources</p>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Premium reports include:</strong> Bank-verified transaction data,
                income averages (weekly/monthly), platform breakdown, consistency analysis, verification statement,
                and professional formatting suitable for lender review.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-foreground">
              Questions About Accepting GigProof Reports?
            </h3>
            <p className="mb-6 text-muted-foreground">
              Contact our lender relations team for more information, sample reports, or integration options
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/verify">
                <Button variant="hero" size="lg">
                  Verify Reports
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Report Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LenderSection;
