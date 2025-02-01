import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div>
      <p>The page might have been moved, deleted, or never existed.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
}
