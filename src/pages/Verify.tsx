import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, Loader2, Key, Building2, ArrowRight, Mail, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Verify = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const verificationRef = useRef<HTMLDivElement>(null);

  // Scroll to verification section when triggered
  const scrollToVerification = () => {
    verificationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-white py-8 md:py-12 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl text-center">
              {/* Logo */}
              <div className="mb-4 md:mb-6 inline-flex items-center justify-center">
                <img src="/assets/logo.png" alt="GigProof" className="h-12 md:h-16 lg:h-20" />
              </div>

              <h1 className="mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground px-4">
                Verify GigProof Report
              </h1>

              <p className="mx-auto max-w-3xl text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed px-4">
                <strong className="text-foreground">Enter the verification code</strong> to view the official income data from our secure database. Compare these authoritative figures against the PDF you received to verify authenticity.
              </p>

              {/* Security Warning Box */}
              <div className="mx-auto max-w-3xl mb-6 md:mb-8 bg-amber-50 border-2 border-amber-200 rounded-xl p-4 md:p-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h3 className="font-bold text-sm md:text-base text-amber-900 mb-1 md:mb-2">Server-Authoritative Verification</h3>
                    <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                      All income data displayed comes directly from our secure database, not from the PDF file. Any discrepancy between the PDF and our records indicates the document has been altered or is inconsistent with GigProof data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="mx-auto max-w-4xl space-y-8 md:space-y-12">

            {/* Verification Section */}
            <section ref={verificationRef} className="scroll-mt-8">
              <div className="text-center mb-6 md:mb-8 px-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 md:mb-3">
                  Enter Verification Code
                </h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Find the code on the PDF report (format: GIGI-XXXXXXXXXXXX)
                </p>
              </div>

        {/* Code Entry Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-10 border border-gray-200">
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const code = formData.get('code') as string;

            if (!code) {
              setResult({
                valid: false,
                message: 'Please enter a verification code.'
              });
              return;
            }

            setLoading(true);
            setResult(null);

            try {
              const { data, error } = await supabase.functions.invoke('verify-report', {
                body: { code: code.toUpperCase().trim() }
              });

              if (error) throw error;
              setResult(data);
              scrollToVerification();
            } catch (error) {
              console.error('Verification error:', error);
              setResult({
                valid: false,
                message: 'Verification code not found or invalid.'
              });
            } finally {
              setLoading(false);
            }
          }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="code"
                placeholder="GIGI-XXXXXXXXXXXX"
                className="flex-1 px-3 md:px-4 py-3 md:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono text-base md:text-lg transition-all"
                disabled={loading}
                autoFocus
              />
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={loading}
                className="w-full sm:w-auto sm:px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5 mr-2" />
                    Verify Report
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className={`mt-6 md:mt-8 p-4 md:p-6 lg:p-8 rounded-xl border-2 ${
              result.valid && result.status === 'valid'
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 mt-0.5 md:mt-1">
                  {result.valid && result.status === 'valid' ? (
                    <CheckCircle className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 ${
                    result.valid && result.status === 'valid'
                      ? 'text-green-900'
                      : 'text-red-900'
                  }`}>
                    {result.valid && result.status === 'valid'
                      ? 'REPORT VERIFIED - AUTHENTIC'
                      : 'VERIFICATION FAILED'}
                  </h3>

                  {result.valid && result.status === 'valid' ? (
                    <div className="space-y-3 md:space-y-4">
                      <p className="text-green-800 text-sm md:text-base font-medium">
                        ✓ Authentic report issued by GigProof
                      </p>

                      {/* DISPLAY SERVER-STORED INCOME DATA */}
                      {result.incomeData && (
                        <div className="bg-white rounded-lg p-4 md:p-6 border border-green-200 space-y-4 md:space-y-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">
                              Official Income Data (from GigProof database)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                              <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                                <span className="text-gray-600 text-xs md:text-sm block mb-1">90-Day Total Income</span>
                                <span className="font-bold text-xl md:text-2xl text-green-700">
                                  {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: result.incomeData.iso_currency_code || 'USD',
                                    minimumFractionDigits: 0,
                                  }).format(result.incomeData.total_90_days)}
                                </span>
                              </div>
                              <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                                <span className="text-gray-600 text-xs md:text-sm block mb-1">Monthly Average</span>
                                <span className="font-bold text-xl md:text-2xl text-green-700">
                                  {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: result.incomeData.iso_currency_code || 'USD',
                                    minimumFractionDigits: 0,
                                  }).format(result.incomeData.monthly_average)}
                                </span>
                              </div>
                              <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                                <span className="text-gray-600 text-xs md:text-sm block mb-1">Weekly Average</span>
                                <span className="font-bold text-lg md:text-xl text-green-700">
                                  {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: result.incomeData.iso_currency_code || 'USD',
                                    minimumFractionDigits: 0,
                                  }).format(result.incomeData.weekly_average)}
                                </span>
                              </div>
                              <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                                <span className="text-gray-600 text-xs md:text-sm block mb-1">Consistency Score</span>
                                <span className="font-bold text-lg md:text-xl text-green-700">
                                  {result.incomeData.consistency_score}%
                                </span>
                              </div>
                            </div>

                            {/* LENDER INSTRUCTION */}
                            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
                                <strong>Verification Instruction:</strong> Compare the figures above against the PDF you received from the applicant.
                                If the numbers match, the document is legitimate. If they differ, the document appears altered or inconsistent with GigProof records.
                              </p>
                            </div>
                          </div>

                          {/* Technical Details */}
                          <div className="pt-3 md:pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                              <div>
                                <span className="text-gray-600 block mb-1">Verification Code</span>
                                <span className="font-mono font-semibold text-gray-900 text-xs md:text-sm break-all">
                                  {result.verificationCode}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 block mb-1">Report Generated</span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(result.generatedDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 block mb-1">Income Period</span>
                                <span className="font-semibold text-gray-900 text-xs md:text-sm">
                                  {new Date(result.verificationPeriod.start).toLocaleDateString()} - {new Date(result.verificationPeriod.end).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 block mb-1">Times Verified</span>
                                <span className="font-semibold text-gray-900">
                                  {result.verificationCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-red-800 text-sm md:text-base font-medium">
                        Report not found or invalid verification code.
                      </p>
                      <p className="text-red-700 text-xs md:text-sm">
                        This could mean:
                      </p>
                      <ul className="text-red-700 text-xs md:text-sm list-disc list-inside space-y-1 ml-2">
                        <li>The verification code was entered incorrectly</li>
                        <li>This is not an authentic GigProof report</li>
                        <li>The report has expired or been deleted</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

            </section>

            {/* How It Works */}
            <section className="px-4">
              <div className="text-center mb-6 md:mb-8 lg:mb-10">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 md:mb-3">How Verification Works</h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
                  Simple, secure, and reliable verification in three steps
                </p>
              </div>
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg md:text-xl">
                    1
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Enter Code</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Type or paste the verification code printed on the PDF report (GIGI-XXXXXXXXXXXX format).
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg md:text-xl">
                    2
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">View Official Data</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Our system displays the authoritative income figures directly from our secure database.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg md:text-xl">
                    3
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Compare & Verify</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Compare the displayed figures against the PDF. Matching numbers = legitimate document.
                  </p>
                </div>
              </div>
            </section>

            {/* Security Features */}
            <section className="px-4">
              <div className="text-center mb-6 md:mb-8 lg:mb-10">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2 md:mb-3">Bank-Verified Security</h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
                  GigProof uses bank-verified data to help lenders detect altered documents
                </p>
              </div>
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Server-Authoritative Data</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Income data comes from our database, computed directly from bank transactions. Users cannot modify these figures.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Key className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Cryptographic Verification Codes</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Codes are generated server-side using cryptographically secure random generation. Extremely difficult to forge or guess, protected by rate limiting.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Tamper Detection</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Compare PDF figures against our database. Any discrepancy instantly reveals document alteration or inconsistency.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                  <div className="mb-3 md:mb-4 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10">
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">Audit Trail</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    All verification attempts are logged with timestamp, IP address, and user agent for security auditing.
                  </p>
                </div>
              </div>
            </section>

            {/* Partnership Opportunities */}
            <section className="rounded-xl md:rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-6 lg:p-8 xl:p-12 mx-4">
              <div className="text-center space-y-4 md:space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 mb-2 md:mb-4">
                  <Building2 className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-primary" />
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground px-4">For Lenders & Institutions</h2>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                  Need high-volume verification, API access, or custom integration? We're onboarding partners for advanced features.
                </p>
                <div className="pt-2 md:pt-4">
                  <Link to="/contact">
                    <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                      Discuss Partnership <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Direct Contact */}
            <div className="text-center pt-6 md:pt-8 px-4">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Questions about verification?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Our team is ready to help with any verification questions or concerns.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/contact" className="flex items-center gap-2 text-primary font-semibold hover:underline text-sm md:text-base">
                  <Mail className="h-4 w-4 md:h-5 md:w-5" /> Contact Support
                </Link>
              </div>
            </div>

            <div className="pt-8 md:pt-12 text-center px-4">
              <Link to="/" className="text-primary hover:underline text-sm md:text-base">
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

export default Verify;
