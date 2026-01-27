import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Target, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                About GigProof
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Empowering gig workers to prove their income and unlock financial opportunities
              </p>
            </div>
          </div>
        </div>

        <div className="container py-12 md:py-16">
          {/* Mission */}
          <section className="mx-auto max-w-4xl space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  GigProof exists to solve a critical problem facing millions of gig workers: the inability to prove
                  their income to lenders, landlords, and financial institutions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that gig workers deserve the same financial opportunities as traditional employees.
                  Our mission is to bridge the gap between gig economy income and financial acceptance.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-8 shadow-card">
                <h3 className="mb-4 text-xl font-semibold text-foreground">The Problem We Solve</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>Gig workers earn good money but can't prove it with traditional paystubs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>Banks and landlords reject applications due to "unverifiable income"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>Forced into high-interest loans costing thousands extra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>No easy solution exists for individual gig workers</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Help */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="text-center mb-12">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground">How We Help</h2>
              <p className="text-lg text-muted-foreground">
                GigProof provides bank-verified income reports that lenders and landlords actually accept
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Bank-Verified</h3>
                <p className="text-muted-foreground">
                  We connect directly to your bank via Plaid, the same secure system used by major financial apps.
                  No screenshots or manual entry needed.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Automatic Detection</h3>
                <p className="text-muted-foreground">
                  Our system automatically identifies gig income from <strong>Uber, DoorDash, Deliveroo, Lyft, Instacart, Fiverr, Upwork, Amazon Flex, TaskRabbit,</strong> and many more.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Lender-Approved</h3>
                <p className="text-muted-foreground">
                  Our professional PDF reports include everything lenders need: verified transactions, income averages,
                  consistency analysis, and professional formatting.
                </p>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-8 shadow-card">
              <div className="mb-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-foreground">Trust & Security</h2>
                <p className="text-muted-foreground">
                  We take your data security seriously
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Security Standards</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>256-bit SSL encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Plaid integration (SOC 2 Type II certified)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Bank-level security protocols</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>We never store your bank login credentials</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Privacy & Compliance</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>GDPR compliant</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Transparent data practices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Regular security audits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Your data, your control</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">Ready to Get Started?</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Join thousands of gig workers who have successfully proven their income
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="lg">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <div className="mx-auto mt-12 max-w-4xl pt-8">
            <Link to="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
