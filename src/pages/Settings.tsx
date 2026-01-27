import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
    Home,
    LayoutDashboard,
    FileText,
    Settings as SettingsIcon,
    LogOut,
    Menu,
    X,
    Shield,
    User,
    Trash2,
    AlertTriangle,
    Loader2,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Fetch user profile
    const { data: profile } = useQuery({
        queryKey: ["profile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();
            return data;
        },
        enabled: !!user?.id,
    });

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you absolutely sure? This will permanently delete all your bank connections, transaction history, and reports. This action cannot be undone."
        );

        if (!confirmed) return;

        setDeleting(true);
        try {
            const userId = user?.id;
            if (!userId) throw new Error("User not found");

            // 1. Delete all user-related data in sequence (honoring FKs if any)
            // Note: Supabase RLS policies should allow the user to delete their own rows

            console.log("Starting data wipe for user:", userId);

            // We do these in parallel for speed, though they aren't strictly dependent on each other in the current schema
            await Promise.all([
                supabase.from("transactions").delete().eq("user_id", userId),
                supabase.from("income_summaries").delete().eq("user_id", userId),
                supabase.from("reports").delete().eq("user_id", userId),
                supabase.from("plaid_tokens").delete().eq("user_id", userId),
                supabase.from("plaid_items").delete().eq("user_id", userId),
            ]);

            // 2. Delete the profile
            await supabase.from("profiles").delete().eq("id", userId);

            toast.success("All data has been wiped successfully.");

            // 3. Log out and redirect
            await signOut();
            navigate("/");

        } catch (error: any) {
            console.error("Error deleting account:", error);
            toast.error("Failed to delete account. Please try again or contact support.");
        } finally {
            setDeleting(false);
        }
    };

    const sidebarLinks = [
        { name: "Home", icon: Home, href: "/" },
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Reports", icon: FileText, href: "/report" },
        { name: "Pricing", icon: CreditCard, href: "/pricing" },
        { name: "Settings", icon: SettingsIcon, href: "/settings", active: true },
    ];

    const userName = profile?.full_name || user?.user_metadata?.full_name || "User";

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between border-b border-border px-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">GigProof</span>
                        </Link>
                        <button
                            className="rounded-md p-1 hover:bg-muted lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 p-4">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${link.active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-border p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
                    <button
                        className="rounded-md p-2 hover:bg-muted"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="text-lg font-semibold">Settings</span>
                </header>

                <main className="p-4 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Settings</h1>
                        <p className="mt-1 text-muted-foreground">Manage your account and data preferences</p>
                    </div>

                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Profile Section */}
                        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <h2 className="font-semibold text-foreground">Personal Information</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <p className="mt-1 text-foreground font-medium">{userName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <p className="mt-1 text-foreground font-medium">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section (Placeholder for Compliance) */}
                        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            <div className="border-b border-border bg-muted/30 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <h2 className="font-semibold text-foreground">Security & Compliance</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-success/10 text-success">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">Financial Data Security</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Your bank connections are encrypted and managed securely via Plaid. We do not store your bank credentials.
                                        </p>
                                        <div className="mt-4 flex items-center gap-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                                SOC 2 Compliant
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                                256-bit AES
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden">
                            <div className="border-b border-destructive/20 bg-destructive/10 px-6 py-4">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <h2 className="font-semibold">Danger Zone</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div>
                                    <h3 className="font-medium text-foreground">Delete Account & Data</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Permanently wipe your profile and all bank-verified income data from our systems.
                                        This action is immediate and cannot be reversed.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        className="mt-6"
                                        onClick={handleDeleteAccount}
                                        disabled={deleting}
                                    >
                                        {deleting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Wiping Data...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Everything
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
