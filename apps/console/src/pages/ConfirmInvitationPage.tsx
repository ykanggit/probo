import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { PayloadError } from "relay-runtime";
import { ConfirmInvitationPageMutation } from "./__generated__/ConfirmInvitationPageMutation.graphql";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ConfirmInvitationMutation = graphql`
  mutation ConfirmInvitationPageMutation($input: ConfirmInvitationInput!) {
    confirmInvitation(input: $input) {
      success
    }
  }
`;

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
  const [commitMutation] = useMutation<ConfirmInvitationPageMutation>(
    ConfirmInvitationMutation
  );

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
      commitMutation({
        variables: {
          input: {
            token: token.trim(),
            password: password,
          },
        },
        onCompleted: (response, errors: PayloadError[] | null) => {
          if (errors) {
            throw new Error(
              errors[0]?.message || "Failed to confirm invitation"
            );
          }

          setIsConfirmed(true);
          toast({
            title: "Success",
            description: "Your invitation has been confirmed successfully",
          });

          setIsLoading(false);
        },
        onError: (err) => {
          setError(
            err.message || "Failed to confirm invitation. Please try again."
          );
          setIsLoading(false);
        },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to confirm invitation. Please try again."
      );
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
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
