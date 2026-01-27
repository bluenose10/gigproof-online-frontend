import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, FileText, Database, UserCheck, Cookie, Clock, Baby, RefreshCw } from "lucide-react";

const Privacy = () => {
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
                Privacy Policy
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
              <h2 className="mb-4 text-2xl font-bold text-foreground">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At GigProof, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our service. By using GigProof, you agree to
                the collection and use of information in accordance with this policy.
              </p>
            </div>

            <div className="space-y-6">
              {/* Data Collection */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">Account Information</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      When you create an account, we collect your email address, name, and password. This information
                      is used to create and manage your account.
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">Bank Account Data via Plaid</h3>
                    <p className="mb-3 text-muted-foreground leading-relaxed">
                      When you connect your bank account through Plaid, we receive transaction data including:
                    </p>
                    <ul className="space-y-2 ml-6 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Transaction amounts and dates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Merchant names and transaction descriptions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>Account information (account type, institution name)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>No login credentials are ever stored or accessible to us</span>
                      </li>
                    </ul>
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        By using our service, you agree to Plaid's data collection and use practices as described in{" "}
                        <a href="https://plaid.com/legal/#end-user-privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:no-underline">
                          Plaid's Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Use Data */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
                </div>
                <ul className="space-y-2 ml-6 text-muted-foreground">
                  {[
                    "Generate income verification reports from your transaction data",
                    "Calculate income averages, consistency scores, and platform breakdowns",
                    "Provide customer support and respond to your inquiries",
                    "Improve our service and develop new features",
                    "Send important service-related communications",
                    "Comply with legal obligations and prevent fraud"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Security */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">256-bit SSL encryption</h4>
                      <p className="text-sm">For all data in transit</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">Encrypted storage</h4>
                      <p className="text-sm">All sensitive data at rest</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">Plaid integration</h4>
                      <p className="text-sm">SOC 2 Type II certified provider</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">Access controls</h4>
                      <p className="text-sm">Authorized personnel only</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                      We never store your bank login credentials. All bank connections are handled securely through Plaid's infrastructure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Data Sharing and Disclosure</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="font-semibold">
                    We do not sell your personal information. We may share your data only in the following circumstances:
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-1 font-semibold text-foreground">Service Providers</h4>
                      <p className="text-sm">
                        We work with trusted third-party service providers (like Plaid) who help us operate our service. These providers are contractually obligated to protect your data.
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-1 font-semibold text-foreground">Legal Requirements</h4>
                      <p className="text-sm">
                        We may disclose information if required by law or to protect our rights and safety.
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-1 font-semibold text-foreground">With Your Consent</h4>
                      <p className="text-sm">
                        We may share information with your explicit permission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Your Rights (GDPR Compliance)</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>If you are located in the European Economic Area (EEA), you have certain data protection rights:</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { title: "Right to Access", desc: "Request a copy of your personal data" },
                      { title: "Right to Rectification", desc: "Correct inaccurate or incomplete data" },
                      { title: "Right to Erasure", desc: "Request deletion of your personal data" },
                      { title: "Right to Restrict Processing", desc: "Limit how we use your data" },
                      { title: "Right to Data Portability", desc: "Receive your data in a structured format" },
                      { title: "Right to Object", desc: "Object to processing of your personal data" }
                    ].map((right, i) => (
                      <div key={i} className="rounded-lg bg-muted/50 p-3">
                        <h4 className="mb-1 text-sm font-semibold text-foreground">{right.title}</h4>
                        <p className="text-xs">{right.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4">
                    To exercise these rights, please contact us via{" "}
                    <Link to="/contact" className="font-semibold text-primary hover:underline">
                      our contact form
                    </Link>
                  </p>
                </div>
              </div>

              {/* Cookies */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Cookies and Tracking</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to improve your experience, analyze usage, and
                  assist with security. You can control cookies through your browser settings, though this may affect
                  some functionality.
                </p>
              </div>

              {/* Data Retention */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Data Retention</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal data for as long as your account is active or as needed to provide services.
                  If you delete your account, we will delete or anonymize your data within 30 days, except where we are
                  required to retain it for legal purposes.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Baby className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Children's Privacy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for individuals under 18 years of age. We do not knowingly collect
                  personal information from children.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Changes to This Privacy Policy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                  the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us via{" "}
                <Link to="/contact" className="font-semibold text-primary hover:underline">
                  our contact form
                </Link>.
              </p>
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

export default Privacy;
