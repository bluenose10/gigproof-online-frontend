import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Shield, Clock } from "lucide-react";

const DoorDashIncomeVerification = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl px-4 sm:px-6">
          {/* Hero Section */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            DoorDash Income Verification - Proof of Income for Dashers
          </h1>

          <p className="mb-8 text-xl text-muted-foreground">
            Bank-verified income reports for DoorDash drivers applying for apartments,
            car loans, and mortgages. Professional proof of earnings you can submit
            to any lender or landlord.
          </p>

          {/* CTA */}
          <div className="mb-12">
            <Link to="/signup" className="block">
              <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                Get Your DoorDash Income Report - $9.99
              </Button>
            </Link>
          </div>

          {/* Content Sections */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">Why DoorDash Dashers Need Income Verification</h2>
            <p className="mb-4 text-muted-foreground">
              As a DoorDash driver (Dasher), you work as an independent contractor without
              traditional W-2 forms or pay stubs. When applying for apartments, car loans,
              or mortgages, landlords and lenders require proof of your income. GigProof
              provides <strong>DoorDash income verification</strong> by connecting directly
              to your bank account and generating a professional report showing your delivery earnings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">What's Included in Your DoorDash Income Report</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <CheckCircle className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Bank-Verified Earnings</h3>
                <p className="text-sm text-muted-foreground">
                  Direct verification of DoorDash deposits to your bank account
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <FileText className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Professional Format</h3>
                <p className="text-sm text-muted-foreground">
                  PDF report with weekly/monthly averages, consistency analysis
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <Shield className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Professional Format</h3>
                <p className="text-sm text-muted-foreground">
                  Designed to meet lender requirements with verified bank data
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <Clock className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Instant Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your bank and download report in 5 minutes
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">How It Works for DoorDash Drivers</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">1</span>
                <div>
                  <h3 className="font-semibold">Sign Up Free</h3>
                  <p className="text-sm text-muted-foreground">Create account in seconds - no payment required to start</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">2</span>
                <div>
                  <h3 className="font-semibold">Connect Bank Securely</h3>
                  <p className="text-sm text-muted-foreground">Bank-level encryption via Plaid (trusted by millions)</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">3</span>
                <div>
                  <h3 className="font-semibold">Download Your Report</h3>
                  <p className="text-sm text-muted-foreground">Get professional PDF showing your DoorDash income history</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12 rounded-lg bg-primary/5 p-8">
            <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Do I need my DoorDash 1099-NEC form?</h3>
                <p className="text-sm text-muted-foreground">
                  No. GigProof verifies your income directly from your bank transactions,
                  so you don't need to wait for tax forms from DoorDash.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Will this show my tips and bonuses?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. GigProof captures all DoorDash-related deposits including base pay,
                  tips, peak pay, challenges, and any other earnings from DoorDash.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">How much does it cost?</h3>
                <p className="text-sm text-muted-foreground">
                  $9.99 for one report, or save 20% with our 10-report bundle at $79.99.
                  Great for multiple apartment or loan applications.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Can I use this for car financing?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. Many DoorDash drivers use our reports to finance vehicles
                  needed for deliveries. Most lenders accept bank-verified documentation.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center">
            <Link to="/signup" className="inline-block w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                Generate Your DoorDash Income Report Now
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Join thousands of Dashers who proved their income • Secure & instant
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoorDashIncomeVerification;
