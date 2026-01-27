import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Shield, Clock } from "lucide-react";

const UberIncomeVerification = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container max-w-4xl px-4 sm:px-6">
          {/* Hero Section */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Uber Driver Income Verification - Prove Your Earnings Instantly
          </h1>

          <p className="mb-8 text-xl text-muted-foreground">
            Bank-verified income reports for Uber drivers applying for apartments,
            car loans, and mortgages. Professional proof of income you can submit
            to any lender or landlord.
          </p>

          {/* CTA */}
          <div className="mb-12">
            <Link to="/signup" className="block">
              <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                Get Your Uber Income Report - $9.99
              </Button>
            </Link>
          </div>

          {/* Content Sections */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">Why Uber Drivers Need Income Verification</h2>
            <p className="mb-4 text-muted-foreground">
              As an Uber driver, you don't receive traditional W-2 forms or paystubs like
              regular employees. When applying for apartments, car loans, or mortgages,
              landlords and lenders need proof of your income. GigProof provides
              <strong> Uber driver income verification</strong> by connecting directly to
              your bank account and generating a professional report that shows your Uber earnings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">What's Included in Your Uber Income Report</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <CheckCircle className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Bank-Verified Earnings</h3>
                <p className="text-sm text-muted-foreground">
                  Direct verification of Uber deposits to your bank account
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <FileText className="mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-2 font-semibold">Professional Format</h3>
                <p className="text-sm text-muted-foreground">
                  PDF report with income averages, consistency scores, and projections
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
                <h3 className="mb-2 font-semibold">5-Minute Process</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your bank, generate report instantly
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold">How It Works for Uber Drivers</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">1</span>
                <div>
                  <h3 className="font-semibold">Create Free Account</h3>
                  <p className="text-sm text-muted-foreground">Sign up in 30 seconds - no credit card required</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">2</span>
                <div>
                  <h3 className="font-semibold">Connect Your Bank</h3>
                  <p className="text-sm text-muted-foreground">Use Plaid's secure connection (trusted by Venmo, Robinhood)</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">3</span>
                <div>
                  <h3 className="font-semibold">Get Your Report</h3>
                  <p className="text-sm text-muted-foreground">Download bank-verified PDF showing your Uber income</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mb-12 rounded-lg bg-primary/5 p-8">
            <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Do I need my Uber 1099 form?</h3>
                <p className="text-sm text-muted-foreground">
                  No. GigProof verifies your income directly from your bank account,
                  so you don't need to wait for annual 1099 forms from Uber.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Will this work for Uber Eats too?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes. GigProof captures all Uber-related deposits including Uber Eats,
                  Uber rides, and any other earnings from Uber Technologies.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">How much does it cost?</h3>
                <p className="text-sm text-muted-foreground">
                  $9.99 for a single report, or $79.99 for 10 reports (20% discount).
                  Perfect if you're shopping for multiple apartments or loans.
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <div className="text-center">
            <Link to="/signup" className="inline-block w-full sm:w-auto">
              <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                Generate Your Uber Income Report Now
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Trusted by thousands of Uber drivers • Bank-level security
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UberIncomeVerification;
