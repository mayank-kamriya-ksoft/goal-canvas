import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = mode === "login" 
        ? await login(email, password)
        : await signup(email, password);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
        navigate("/create");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={mode === "login" ? "Log In" : "Sign Up"}
        description="Access your saved vision boards or create a new account to start saving your goals."
      />

      <section className="section-padding min-h-[calc(100vh-12rem)]">
        <div className="container-narrow">
          <div className="max-w-md mx-auto">
            {/* Tabs */}
            <div className="flex rounded-lg bg-secondary p-1 mb-8">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  mode === "login"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  mode === "signup"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <div className="card-elevated p-8">
              <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                {mode === "login" ? "Welcome Back" : "Create Your Account"}
              </h1>
              <p className="text-muted-foreground mb-6">
                {mode === "login"
                  ? "Sign in to access your saved vision boards"
                  : "Start saving and managing your vision boards"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:outline-none ${
                        errors.email ? "border-destructive" : "border-input"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-ring focus:outline-none ${
                        errors.password ? "border-destructive" : "border-input"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-primary font-medium hover:underline"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Guest mode notice */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/create" className="text-primary hover:underline">
                Continue as guest
              </Link>{" "}
              — you can still create and download boards without an account
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
