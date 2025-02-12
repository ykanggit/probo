import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Probo Console</title>
      </Helmet>
      <div>
        <p>The page might have been moved, deleted, or never existed.</p>
        <Link to="/">Return to Home</Link>
      </div>
    </>
  );
}
