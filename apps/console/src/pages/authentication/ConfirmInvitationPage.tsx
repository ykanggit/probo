import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildEndpoint } from "@/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmInvitationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Extract token from URL and prefill the form
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!token.trim()) {
      setError("Please enter a confirmation token");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        buildEndpoint("/api/console/v1/auth/invitation"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token: token.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to confirm invitation");
      }

      setIsConfirmed(true);
      toast({
        title: "Success",
        description: "Your invitation has been confirmed successfully",
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to confirm invitation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Confirm Invitation - Probo</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Invitation Confirmation
            </CardTitle>
            <CardDescription className="text-center">
              Complete your account setup to join the organization
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isConfirmed ? (
              <div className="space-y-4 text-center">
                <p className="text-green-600 dark:text-green-400">
                  Your invitation has been confirmed successfully!
                </p>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Proceed to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="token">Invitation Token</Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your invitation token"
                    disabled={isLoading}
                    required
                    autoComplete="off"
                  />
                  <p className="text-xs text-secondary dark:text-tertiary">
                    The token has been automatically filled from the URL if
                    available
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Confirming..." : "Complete Registration"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            {!isConfirmed && (
              <Link
                to="/login"
                className="text-sm text-secondary hover:text-primary dark:text-tertiary dark:hover:text-quaternary"
              >
                Back to Login
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
