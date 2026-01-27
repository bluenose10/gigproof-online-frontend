import { Shield, Lock, Key } from "lucide-react";

const PlaidExplainer = () => {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container">
                <div className="mx-auto max-w-4xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-6">
                        <Lock className="h-4 w-4" />
                        Security First
                    </div>
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                        "Wait, do I give you my bank password?"
                    </h2>
                    <p className="text-2xl font-bold text-primary mb-6">
                        NO. Absolutely not.
                    </p>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We use <strong>Plaid</strong>, the same secure technology used by Venmo, Chime, and Robinhood.
                        Here is exactly how it works:
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">1. You Log In Securely</h3>
                        <p className="text-muted-foreground">
                            You log in through Plaid's secure window. <strong>GigProof never sees or stores your username or password.</strong> It stays between you and your bank.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Key className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">2. We Get a "Token"</h3>
                        <p className="text-muted-foreground">
                            Plaid verifies you are you, and hands us a secure "Access Token." This is like a digital key that only works for reading transaction history.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">3. Your Data is Read-Only</h3>
                        <p className="text-muted-foreground">
                            We can <strong>only read</strong> your deposits to verify income. We cannot move money, make charges, or change any settings.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        Trusted by millions of users across the world's biggest finance apps
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                        {/* Simple text representation for trust since we don't have SVGs handy, kept clean */}
                        <span className="font-bold text-xl">Venmo</span>
                        <span className="font-bold text-xl">•</span>
                        <span className="font-bold text-xl">Robinhood</span>
                        <span className="font-bold text-xl">•</span>
                        <span className="font-bold text-xl">Chime</span>
                        <span className="font-bold text-xl">•</span>
                        <span className="font-bold text-xl">Wise</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlaidExplainer;
