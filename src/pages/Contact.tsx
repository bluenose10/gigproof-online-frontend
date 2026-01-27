import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageSquare, CheckCircle, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Netlify form submission is handled automatically
    // This just triggers the success message after submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

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
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
                Get in Touch
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Have questions about GigProof? We're here to help. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="container py-12 md:py-16">
          {/* Contact Form Section */}
          <section className="mx-auto max-w-2xl">
            {isSubmitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Thank You!</h2>
                <p className="mb-6 text-muted-foreground">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <Link to="/">
                  <Button variant="hero" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                netlify-honeypot="bot-field"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-card"
              >
                {/* Hidden fields for Netlify */}
                <input type="hidden" name="form-name" value="contact" />
                <p hidden>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-foreground">
                    Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-muted/50 border-border pl-10"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-semibold text-foreground">
                    Message
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help..."
                      required
                      rows={6}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button variant="hero" size="lg" type="submit" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  We typically respond within 24 hours during business days.
                </p>
              </form>
            )}
          </section>

          {/* Contact Information Cards & Meet the Founder */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Contact Form</h3>
                  <p className="text-muted-foreground">
                    For all inquiries, please use the contact form above. We'll respond within 24 hours.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">LinkedIn</h3>
                  <p className="text-muted-foreground">
                    Connect with us for updates and professional networking.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/mark-moran-blockchain-solutions-architect/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    View Founder Profile →
                  </a>
                </div>
              </div>

              {/* Founder Bio - Trust Anchor */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-card md:p-8">
                <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <img
                      src="/assets/founder.jpg"
                      alt="Mark Moran - GigProof Founder"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Mark Moran</h3>
                    <p className="text-sm font-medium text-primary">Founder & Architect</p>
                    <p className="text-xs text-muted-foreground">Liverpool, UK</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm italic text-muted-foreground">
                    "After 20 years of being self-employed, I know the frustration of having plenty of income but zero
                    ways to prove it for a loan or rent. I built GigProof to bridge that gap for workers like us."
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground opacity-70">Qualifications</h4>
                    <ul className="grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" /> MSc Cyber Security
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" /> BSc (Hons) Computing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" /> Blockchain Solutions Architect
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-primary" /> AI & Information Technology Expert
                      </li>
                    </ul>
                  </div>
                </div>
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

export default Contact;
