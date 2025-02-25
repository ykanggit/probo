import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildEndpoint } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !fullName) {
      toast({
        title: "Error",
        description: "Full name, email, and password are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(buildEndpoint("/console/v1/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      // Check authentication status after registration
      await checkAuth();

      // Redirect to home page after successful registration
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign up - Probo</title>
      </Helmet>

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your information to create an account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up with email"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in here
            </Link>
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" disabled={isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M17.13 17.13v-4.26l-3.2 3.2a4.33 4.33 0 0 1-6.13-6.13l3.2-3.2h-4.26" />
          </svg>
          Sign up with Google
        </Button>
      </div>
    </>
  );
}
