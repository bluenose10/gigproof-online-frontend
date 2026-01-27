import { Building2, BarChart3, FileText } from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "Connect Your Bank",
    description:
      "Securely link your bank account through Plaid. We use bank-level encryption and never store your credentials.",
    step: "01",
  },
  {
    icon: BarChart3,
    title: "We Analyze Deposits",
    description:
      "Our AI automatically detects payments from Uber, DoorDash, Deliveroo, Lyft, Instacart, Fiverr, Upwork, and more.",
    step: "02",
  },
  {
    icon: FileText,
    title: "Download Report",
    description:
      "Get a professional PDF with income averages, charts, projections, and consistency metrics that lenders trust.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get your verified income report in minutes, not days
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-elevated hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Step number */}
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                {step.step}
              </div>

              {/* Icon */}
              <div className="mb-6 mt-2 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
