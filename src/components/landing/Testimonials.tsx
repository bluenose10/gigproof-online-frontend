import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Saved me $4,000 on my car loan! Banks finally took my income seriously with GigProof's verified report.",
    author: "Alex M.",
    role: "DoorDash Driver",
    rating: 5,
  },
  {
    quote:
      "Got approved for my dream apartment after being rejected 3 times. The landlord loved the professional report format.",
    author: "Sarah K.",
    role: "Uber & Lyft Driver",
    rating: 5,
  },
  {
    quote:
      "The 90-day income summary made my mortgage application so much smoother. Worth every penny!",
    author: "Marcus J.",
    role: "Instacart Shopper",
    rating: 5,
  },
  {
    quote:
      "Finally, something that shows my real earning potential. Got pre-approved for a credit card with a $10k limit.",
    author: "Emma T.",
    role: "Multi-App Driver",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Trusted by Gig Workers Everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands who've successfully proven their income
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-card transition-all hover:shadow-elevated hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-6 text-foreground">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
