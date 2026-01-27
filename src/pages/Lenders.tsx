import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building2, Shield, Lock, FileText, CheckCircle, ArrowRight, Mail, Key, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Lenders = () => {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState("");

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (verificationCode.trim()) {
            navigate(`/verify?code=${verificationCode.toUpperCase()}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-white py-16 md:py-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <Building2 className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                                PDF Verification For Lenders
                            </h1>
                            <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground mb-8">
                                Verify gig worker income in seconds with cryptographically secure, tamper-proof reports.
                                No dashboard needed - validate any GigProof report instantly.
                            </p>

                            {/* Quick Verification Form */}
                            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-200">
                                <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                                        placeholder="Enter verification code (GIG-XXXXXXXX)"
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base font-mono tracking-wider"
                                        maxLength={12}
                                    />
                                    <Button
                                        type="submit"
                                        variant="hero"
                                        size="lg"
                                        className="gap-2 whitespace-nowrap w-full sm:w-auto"
                                        disabled={!verificationCode.trim()}
                                    >
                                        <Shield className="h-4 w-4" />
                                        Verify Report
                                    </Button>
                                </form>
                                <p className="text-sm text-gray-500 mt-3 text-center">
                                    Every GigProof report includes a unique verification code
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-12">
                    <div className="mx-auto max-w-5xl space-y-16">

                        {/* How Verification Works */}
                        <section>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-foreground mb-3">Bank-Grade Security, Zero Integration Required</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Every GigProof report is cryptographically secured. Verify authenticity in seconds without any technical setup.
                                </p>
                            </div>
                            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Key className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">Server-Side Generation</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Verification codes generated using cryptographically secure algorithms. Impossible to forge or predict.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">HMAC-SHA256 Signatures</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Each report signed with tamper-evident hash. Any modification invalidates the signature.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <FileCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">Fraud Detection</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Every verification attempt logged with IP and timestamp to detect suspicious patterns.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">90-Day Validity</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Reports expire after 90 days to ensure lenders always see current income data.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Value Proposition */}
                        <section>
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-foreground mb-3">Why Lenders Choose GigProof</h2>
                            </div>
                            <div className="grid gap-4 md:gap-8 md:grid-cols-3">
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <Shield className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">Bank-Verified Data</h3>
                                    <p className="text-muted-foreground">
                                        Data pulled directly from 12,000+ financial institutions via Plaid. No more easily-altered paystubs.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">Consistency Scoring</h3>
                                    <p className="text-muted-foreground">
                                        Algorithms analyze 90-day income stability, providing a reliable risk metric for variable income.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-card">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <CheckCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-foreground">Instant Validation</h3>
                                    <p className="text-muted-foreground">
                                        No waiting, no API integration. Verify any report in seconds using the code on the PDF.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Partnership Opportunities */}
                        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 lg:p-12">
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <Building2 className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Looking for Custom Integration?</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                    Need high-volume verification, API access, or custom features? We're onboarding select partners for advanced integrations.
                                </p>
                                <div className="pt-4">
                                    <Link to="/contact">
                                        <Button variant="hero" size="lg" className="gap-2">
                                            Discuss Partnership <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Direct Contact */}
                        <div className="text-center pt-8">
                            <h3 className="text-xl font-bold mb-4">Prefer a direct conversation?</h3>
                            <p className="text-muted-foreground mb-6">
                                Our lender relations team is ready to discuss custom integrations or high-volume needs.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link to="/contact" className="flex items-center gap-2 text-primary font-semibold hover:underline">
                                    <Mail className="h-5 w-5" /> Contact Us
                                </Link>
                            </div>
                        </div>

                        <div className="pt-12 text-center">
                            <Link to="/" className="text-primary hover:underline">
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

export default Lenders;
