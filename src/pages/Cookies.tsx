import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Cookie } from "lucide-react";

const Cookies = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-3">
                                <Cookie className="h-5 w-5 text-primary" />
                                <span className="text-sm font-semibold text-primary">Cookie Policy</span>
                            </div>
                            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                Cookie Policy
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                                How we use cookies to improve your experience
                            </p>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container py-12 md:py-20">
                    <div className="mx-auto max-w-4xl space-y-12">
                        {/* What are cookies */}
                        <section className="rounded-2xl border border-border bg-card p-8 shadow-card">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">What Are Cookies?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Cookies are small text files that are placed on your device when you visit a website. They help the website remember your preferences and improve your experience.
                            </p>
                        </section>

                        {/* How we use cookies */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground">How We Use Cookies</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-2 text-lg font-bold text-foreground">Essential Cookies</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Required for the platform to function correctly. These cannot be disabled.
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Authentication and session management</li>
                                        <li>Security and fraud prevention</li>
                                        <li>Load balancing</li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-2 text-lg font-bold text-foreground">Analytics Cookies</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Help us understand how our service is used and improve performance.
                                    </p>
                                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Google Analytics (anonymized)</li>
                                        <li>Page view tracking</li>
                                        <li>Error monitoring</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Managing cookies */}
                        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">Managing Your Cookie Preferences</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                You can control cookie preferences through your browser settings. Most browsers allow you to:
                            </p>
                            <ul className="text-muted-foreground space-y-2 list-disc list-inside ml-4">
                                <li>View and delete cookies</li>
                                <li>Block third-party cookies</li>
                                <li>Block cookies from specific sites</li>
                                <li>Block all cookies (may affect functionality)</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                Note: Disabling essential cookies may prevent you from using certain features of GigProof.
                            </p>
                        </section>

                        <div className="pt-8">
                            <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
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

export default Cookies;
