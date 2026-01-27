import { useNavigate, Link } from "react-router-dom";
import { Check, Zap, Crown, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free Preview",
    description: "See what your report looks like before buying",
    price: "$0",
    period: "forever",
    cta: "Get Free Report",
    ctaVariant: "outline" as const,
    popular: false,
    planType: "free",
    credits: 0,
    priceId: null,
    icon: Shield,
    features: [
      "Bank-verified income data",
      "Basic income summary",
      "Full transaction history",
      "See what lenders will review",
      "No credit card required",
    ],
    notIncluded: [
      "Watermarked (not for submission)",
      "No detailed charts",
      "No 12-month projections",
      "No consistency analysis",
    ],
  },
  {
    name: "1 PDF Report",
    description: "Perfect for one-time apartment or loan applications",
    price: "$9.99",
    period: "one-time",
    cta: "Buy 1 Report",
    ctaVariant: "hero" as const,
    popular: false,
    planType: "single",
    credits: 1,
    priceId: "price_1SqYIRCR4lM1NiVBBXsSsF5e", // 1 PDF $9.99 LIVE
    icon: Zap,
    features: [
      "Bank-verified income data",
      "Professional PDF report",
      "No watermarks",
      "Full transaction history",
      "12-month income projections",
      "Consistency analysis",
      "Verification link for lenders",
      "30-day money-back guarantee",
      "Priority email support",
    ],
    notIncluded: [],
  },
  {
    name: "10 PDF Reports",
    description: "Best value for multiple applications",
    price: "$79.99",
    period: "one-time",
    cta: "Buy 10 Reports",
    ctaVariant: "success" as const,
    popular: true,
    planType: "bundle",
    credits: 10,
    priceId: "price_1SqYG0CR4lM1NiVB3WCxe8tP", // 10 PDFs $79.99 LIVE
    icon: Crown,
    features: [
      "Everything in single report, plus:",
      "10 report credits",
      "Save $20 vs buying individually",
      "Connect multiple bank accounts",
      "Real-time income tracking",
      "Custom date ranges",
      "Download reports anytime",
      "Dedicated support",
      "Credits never expire",
    ],
    notIncluded: [],
  },
];

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCheckout = async (plan: typeof pricingPlans[0]) => {
    setLoadingPlan(plan.name);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please log in to continue");
        navigate("/login");
        return;
      }

      // Call Stripe checkout edge function directly
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            planType: plan.planType,
            userId: session.user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Stripe checkout error:", error);
        toast.error("Failed to start checkout. Please try again.");
        return;
      }

      const data = await response.json();

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Stripe error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free with a watermarked preview, or get a professional report ready to submit.
              No hidden fees, 30-day money-back guarantee on paid plans.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="-mt-8 pb-20 md:pb-28">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border bg-card p-8 shadow-card ${plan.popular
                    ? "border-primary shadow-glow-primary"
                    : "border-border"
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${plan.popular ? "bg-primary/10" : "bg-muted"
                      }`}
                  >
                    <plan.icon
                      className={`h-6 w-6 ${plan.popular ? "text-primary" : "text-muted-foreground"
                        }`}
                    />
                  </div>

                  {/* Header */}
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>

                  {/* CTA */}
                  {plan.planType === "free" ? (
                    <Link to="/signup" className="block">
                      <Button
                        variant={plan.ctaVariant}
                        className="w-full"
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant={plan.ctaVariant}
                      className="w-full"
                      size="lg"
                      onClick={() => handleCheckout(plan as any)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === plan.name ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {plan.cta}
                    </Button>
                  )}

                  {/* Features */}
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-muted-foreground/60"
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 opacity-30" />
                        <span className="text-sm line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Have questions?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Check out our FAQ or contact our support team
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/#faq">
                <Button variant="outline">View FAQ</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost">Contact Support</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Money back guarantee */}
        <section className="border-t border-border py-12">
          <div className="container">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-success/10">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  30-Day Money-Back Guarantee
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Not satisfied with your report? We'll refund your purchase, no questions asked.
                  Your trust is our priority.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
