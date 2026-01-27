import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Scale, CreditCard, AlertCircle, Shield, User, Ban } from "lucide-react";

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
                <img src="/assets/logo.png" alt="GigProof" className="h-12 w-12 object-contain" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            {/* Introduction Card */}
            <div className="mb-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using GigProof ("the Service"), you agree to be bound by these Terms of Service.
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </div>

            <div className="space-y-6">
              {/* Service Description */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Service Description</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    GigProof provides income verification services for gig economy workers. Our service:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>Connects to your bank account(s) via Plaid to retrieve transaction data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>Analyzes transactions to identify gig economy income sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>Generates income verification reports in PDF format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>Calculates income averages, consistency scores, and platform breakdowns</span>
                    </li>
                  </ul>
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      Important: GigProof provides verified income documentation but does not guarantee
                      loan approval, apartment approval, or acceptance by any third party. The decision to accept our
                      reports is solely at the discretion of lenders, landlords, and other institutions.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Obligations */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">User Obligations</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>By using our Service, you agree to:</p>
                  <ul className="space-y-2 ml-6">
                    {[
                      "Provide accurate and complete information when creating your account",
                      "Maintain the security of your account credentials",
                      "Use the Service only for lawful purposes",
                      "Not attempt to access other users' accounts or data",
                      "Not use the Service to commit fraud or misrepresent your income",
                      "Comply with all applicable laws and regulations",
                      "Not reverse engineer, decompile, or attempt to extract source code"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Payment Terms</h2>
                </div>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Free Tier</h3>
                    <p>
                      Basic income reports with watermarks are available free of charge.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Premium Reports</h3>
                    <p>
                      Free watermarked reports are available to all users. Premium reports without watermarks are available for $9.99 per report or $79.99 for 10 reports. Payment is required before premium report generation.
                      All sales are final unless otherwise stated.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Refunds</h3>
                    <p>
                      We offer a 30-day money-back guarantee for premium reports and subscriptions. Refund requests
                      must be submitted within 30 days of purchase. Contact us via{" "}
                      <Link to="/contact" className="font-semibold text-primary hover:underline">
                        our contact form
                      </Link>{" "}
                      for refund requests.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liability Limitations */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">No Guarantee of Acceptance</h3>
                    <p>
                      GigProof does not guarantee that lenders, landlords, or any third parties will accept our reports. Acceptance is at the sole discretion of the receiving party.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">Data Accuracy</h3>
                    <p>
                      While we strive for accuracy, we cannot guarantee that all transactions will be correctly identified or categorized. You are responsible for reviewing your reports for accuracy.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">Service Availability</h3>
                    <p>
                      We do not guarantee uninterrupted or error-free service. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-2 font-semibold text-foreground">Limitation of Damages</h3>
                    <p>
                      To the maximum extent permitted by law, GigProof shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Intellectual Property</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The Service, including its original content, features, and functionality, is owned by GigProof and
                  protected by international copyright, trademark, and other intellectual property laws. You may not
                  reproduce, distribute, modify, or create derivative works without our express written permission.
                </p>
              </div>

              {/* Account Termination */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Ban className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Account Termination</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We reserve the right to suspend or terminate your account if:</p>
                  <ul className="space-y-2 ml-6">
                    {[
                      "You violate these Terms of Service",
                      "You engage in fraudulent or illegal activity",
                      "You misuse the Service",
                      "Required by law or court order"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    You may delete your account at any time through your account settings. Upon termination, your right
                    to use the Service will immediately cease, and we may delete your data in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Dispute Resolution</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you have a dispute with GigProof, we encourage you to contact us first via{" "}
                    <Link to="/contact" className="font-semibold text-primary hover:underline">
                      our contact form
                    </Link>{" "}
                    to attempt to resolve the issue.
                  </p>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
                    which GigProof operates, without regard to its conflict of law provisions.
                  </p>
                </div>
              </div>

              {/* Changes to Terms */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes
                  by posting the updated Terms on this page and updating the "Last updated" date. Your continued use
                  of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="rounded-lg bg-card p-4">
                <Link to="/contact" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                  Contact us via our contact form →
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
