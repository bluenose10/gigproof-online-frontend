import { XCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProblemSolution = () => {
    return (
        <section className="py-20 md:py-28 bg-muted/30">
            <div className="container">
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                        Why is it so hard to prove you make money?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        You work hard. You earn good money. But traditional banks still treat you like you're unemployed.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* The Problem Side */}
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <XCircle className="w-32 h-32 text-destructive" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive text-sm">
                                    <XCircle className="w-5 h-5" />
                                </span>
                                The "Gig Trap"
                            </h3>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <XCircle className="w-5 h-5 text-destructive shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">"Schrödinger's Income"</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            You make money, but because it comes from 5 different apps (Uber, Fiverr, DoorDash), banks treat it like it doesn't exist.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <XCircle className="w-5 h-5 text-destructive shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">PDF Nightmares</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Downloading 12 different monthly statements, highlighting deposits, and praying the loan officer understands them.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <XCircle className="w-5 h-5 text-destructive shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Instant Rejection</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            "Sorry, we need W-2 paystubs." The conversation ends before you can even explain your earnings.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* The Solution Side */}
                    <div className="rounded-2xl border border-primary/20 bg-card shadow-elevated p-8 relative overflow-hidden transform md:scale-105 transition-transform z-10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle className="w-32 h-32 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                                    <CheckCircle className="w-5 h-5" />
                                </span>
                                The GigProof Way
                            </h3>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">One Professional "Yes"</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            We aggregate all your scattered income streams into a single, bank-verified report that speaks the bank's language.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Consistency Score</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Lenders <i>want</i> to approve you. Our "Stability Score" proves your gig income is just as reliable as a 9-to-5 salary.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Zero Friction</h4>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            Connect via Plaid in 30 seconds. No uploads, no screenshots, just verified proof.
                                        </p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-8 pt-6 border-t border-border">
                                <Link to="/signup">
                                    <Button size="lg" className="w-full md:w-auto font-semibold shadow-lg shadow-primary/20">
                                        Prove Your Income Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
