import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { diagnoseOAuthError, getTroubleshootingSteps } from "@/lib/oauthDiagnostics";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        // Use diagnostic utility to provide helpful error messages
        const diagnostic = diagnoseOAuthError(error.message);
        const steps = getTroubleshootingSteps(error.message);

        // Show user-friendly message
        toast.error(diagnostic.message, {
          duration: 5000,
        });

        // Log detailed diagnostics to console for debugging
        console.group("🔍 Google OAuth Diagnostic");
        console.error("Error:", error.message);
        console.log("Diagnostic:", diagnostic);
        if (steps.length > 0) {
          console.log("Troubleshooting Steps:");
          steps.forEach((step, i) => console.log(`  ${step}`));
        }
        console.groupEnd();
      }
    } catch (err) {
      console.error("Google OAuth error:", err);
      toast.error("Failed to initiate Google sign-in. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-background shadow-sm border border-border/50">
              <img src="/assets/logo.png" alt="GigProof Logo" className="h-full w-full object-contain p-1.5" />
            </div>
            <span className="text-2xl font-bold text-foreground">GigProof</span>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your income reports
            </p>
          </div>

          <div className="mt-8">
            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleLogin}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                variant="hero"
                className="mt-2 w-full"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden bg-gradient-hero lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Your Income, Verified
            </h3>
            <p className="text-muted-foreground">
              Access your professional income reports anytime. Download PDFs that lenders and landlords trust.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              Bank-level security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
