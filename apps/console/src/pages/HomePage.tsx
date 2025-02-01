import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Link } from "react-router";
import type { HomePageQuery as HomePageQueryType } from "./__generated__/HomePageQuery.graphql";

export const HomePageQuery = graphql`
  query HomePageQuery {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        name
      }
    }
  }
`;

export default function HomePage() {
  const [queryRef, loadQuery] =
    useQueryLoader<HomePageQueryType>(HomePageQuery);

  useEffect(() => loadQuery({}), [loadQuery]);

  if (!queryRef) {
    return <HomePageFallback />;
  }

  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent queryRef={queryRef} />
    </Suspense>
  );
}

function HomePageFallback() {
  return <div>Loading...</div>;
}

function HomePageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<HomePageQueryType>;
}) {
  const data = usePreloadedQuery(HomePageQuery, queryRef);

  return (
    <div>
      <h1>User</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link to="/foobar">Go to FooPage</Link>
    </div>
  );
}
