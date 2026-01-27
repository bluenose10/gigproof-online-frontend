import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, CheckCircle } from "lucide-react";
import TrustBadges from "./TrustBadges";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pb-20 pt-16 md:pb-32 md:pt-24">
      {/* Enhanced background decoration with animations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <img src="/assets/logo.png" alt="GigProof Icon" className="h-4 w-4 object-contain" />
              Built for the Gig Economy
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-2 text-sm font-medium text-success">
              <CheckCircle className="h-4 w-4" />
              🇺🇸 Available in the United States
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            Gig Worker Income Verification - Get Approved for{" "}
            <span className="text-gradient-primary">Loans & Apartments</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Bank-verified income reports for <strong>Uber, DoorDash, Instacart, Lyft, Grubhub, Amazon Flex,</strong> and more.
            Professional income verification you can submit to any lender or landlord.
          </p>

          {/* SEO-optimized opening paragraph */}
          <div className="mx-auto mb-6 max-w-3xl text-base text-muted-foreground/90 leading-relaxed">
            <p>
              Over 60 million gig workers struggle with income verification when applying for apartments,
              car loans, and mortgages. Traditional lenders require W-2 forms and paystubs, but gig workers
              earn through platforms like Uber, DoorDash, and Instacart. GigProof provides instant
              <strong> gig worker income verification</strong> using bank-verified transaction data.
              Most lenders accept bank-verified documentation for income verification.
            </p>
          </div>

          {/* CTA */}
          <div className="mb-4">
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Free
              </Button>
            </Link>
          </div>
          <p className="mb-8 text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            No bank credentials stored • Safe & Encrypted
          </p>

          {/* Trust badges */}
          <div className="mt-6">
            <TrustBadges />
          </div>
        </div>

        {/* Enhanced mock dashboard preview with glassmorphism */}
        <div className="mt-16 md:mt-20 animate-fade-in-up">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-elevated">
            <div className="border-b border-border/50 bg-muted/30 backdrop-blur-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:scale-105">
                  <p className="text-sm text-muted-foreground">Weekly Average</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">$1,250</p>
                  <p className="mt-1 text-xs text-primary">↑ 12% from last month</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:scale-105">
                  <p className="text-sm text-muted-foreground">Last 90 Days</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">$15,000</p>
                  <p className="mt-1 text-xs text-muted-foreground">Verified income</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm p-5 transition-all hover:shadow-lg hover:scale-105">
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">3</p>
                  <p className="mt-1 text-xs text-muted-foreground">Connected accounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
