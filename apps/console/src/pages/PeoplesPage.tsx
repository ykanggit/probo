import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import type { PeoplesPageQuery as PeoplesPageQueryType } from "./__generated__/PeoplesPageQuery.graphql";

const PeoplesPageQuery = graphql`
  query PeoplesPageQuery {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        peoples {
          edges {
            node {
              id
              fullName
              primaryEmailAddress
              additionalEmailAddresses
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

function PeoplesPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PeoplesPageQueryType>;
}) {
  const data = usePreloadedQuery(PeoplesPageQuery, queryRef);
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}

function PeoplesPageFallback() {
  return <div>Loading...</div>;
}

export default function PeoplesPage() {
  const [queryRef, loadQuery] = useQueryLoader<PeoplesPageQueryType>(PeoplesPageQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return <PeoplesPageFallback />;
  }

  return (
    <Suspense fallback={<PeoplesPageFallback />}>
      <PeoplesPageContent queryRef={queryRef} />
    </Suspense>
  );
}