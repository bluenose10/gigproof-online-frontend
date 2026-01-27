import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Server, CheckCircle2, ShieldCheck, Database, Zap } from "lucide-react";

const Compliance = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-gradient-hero py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
                                <img src="/assets/logo.png" alt="GigProof" className="h-12 w-12 object-contain" />
                            </div>
                            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                                Security & Compliance
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                                Bank-level security for your financial data in the United States. Zero-persistence credentials, end-to-end encryption, and SOC 2 compliance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container py-12 md:py-20">
                    <div className="mx-auto max-w-4xl space-y-12">
                        {/* Security Philosophy */}
                        <section className="rounded-2xl border border-border bg-card p-8 shadow-card">
                            <h2 className="mb-4 text-2xl font-bold text-foreground">Our Security Philosophy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At GigProof, we believe your financial data belongs to you. Our architecture is designed
                                around <strong className="text-foreground">Zero-Persistence Security</strong> for your most sensitive credentials.
                                We never see, store, or transmit your bank passwords.
                            </p>
                        </section>

                        {/* Plaid Integration */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Server className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">Bank-Level Infrastructure</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                We partner with <strong className="text-foreground">Plaid</strong> to provide secure connectivity to over 12,000 financial
                                institutions globally. Plaid is an industry leader in financial technology security.
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 transition-all group-hover:bg-success/20">
                                        <CheckCircle2 className="h-6 w-6 text-success" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-foreground">SOC 2 Type II</h3>
                                    <p className="text-sm text-muted-foreground">Plaid is SOC 2 Type II compliant, ensuring rigorous security controls and auditing.</p>
                                </div>
                                <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:bg-primary/20">
                                        <Lock className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-foreground">AES-256 Encryption</h3>
                                    <p className="text-sm text-muted-foreground">All data is encrypted at rest using Advanced Encryption Standard (AES-256).</p>
                                </div>
                            </div>
                        </section>

                        {/* Data Protection */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Database className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">Data Protection at Rest & Transit</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4 rounded-xl border border-border bg-muted/30 p-6 transition-all hover:bg-muted/50">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-bold text-foreground">TLS 1.2+ Encryption</h3>
                                        <p className="text-sm text-muted-foreground">All communication between your device, our servers, and bank APIs is protected by Transport Layer Security (TLS).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 rounded-xl border border-border bg-muted/30 p-6 transition-all hover:bg-muted/50">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Database className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-bold text-foreground">Database Hardening</h3>
                                        <p className="text-sm text-muted-foreground">Our production databases are VPC-isolated and require multi-factor authentication for administrative access.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* No Persistence - Featured Section */}
                        <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                                    <Zap className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <h2 className="mb-3 text-2xl font-bold text-primary">No Credential Persistence</h2>
                                    <p className="text-foreground/90 leading-relaxed">
                                        When you link your bank, you are logging in directly through a secure window provided by Plaid or your bank.
                                        GigProof receives a unique, encrypted "Access Token" that allows us only to read your historical transactions.
                                        We have <strong>ZERO ability</strong> to move money, change account settings, or view your login credentials.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Regulatory Compliance */}
                        <section className="rounded-2xl border border-border bg-card p-8 shadow-card">
                            <h2 className="mb-6 text-2xl font-bold text-foreground">US Regulatory Compliance</h2>
                            <p className="mb-6 text-muted-foreground leading-relaxed">
                                We maintain compliance with US regulatory standards:
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { title: "CCPA Compliance", desc: "California Consumer Privacy Act standards for data protection." },
                                    { title: "SOC 2 Type II", desc: "Infrastructure powered by Plaid's certified security framework." },
                                    { title: "TLS 1.2+ Encryption", desc: "Bank-level encryption for all data transmissions." },
                                    { title: "PCI-Compliant Partners", desc: "Payment processing secured through certified providers (Stripe)." },
                                    { title: "Transaction Monitoring", desc: "Fraud prevention and suspicious activity detection." },
                                    { title: "Data Privacy", desc: "User-controlled data deletion and transparent privacy policies." }
                                ].map((item, i) => (
                                    <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
                                        <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-2 font-bold text-foreground">Do you sell my data?</h3>
                                    <p className="text-sm text-muted-foreground">No. We do not sell your personal or financial data to third parties, advertisers, or data brokers.</p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-2 font-bold text-foreground">Can you see my balance?</h3>
                                    <p className="text-sm text-muted-foreground">We only analyze transaction history specifically related to income. While our API access might technically see a balance, we do not store it or display it.</p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-2 font-bold text-foreground">How long do you keep my data?</h3>
                                    <p className="text-sm text-muted-foreground">We retain your data only as long as your account is active. You can delete individual reports at any time, or close your account immediately. When you delete your account, all data is permanently removed right away.</p>
                                </div>
                            </div>
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

export default Compliance;
