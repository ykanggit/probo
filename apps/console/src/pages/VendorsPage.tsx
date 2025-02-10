import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import type { VendorsPageQuery as VendorsPageQueryType } from "./__generated__/VendorsPageQuery.graphql";

const VendorsPageQuery = graphql`
  query VendorsPageQuery {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        vendors {
          edges {
            node {
              id
              name
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

function VendorsPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorsPageQueryType>;
}) {
  const data = usePreloadedQuery(VendorsPageQuery, queryRef);
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}

function VendorsPageFallback() {
  return <div>Loading...</div>;
}

export default function VendorsPage() {
  const [queryRef, loadQuery] = useQueryLoader<VendorsPageQueryType>(VendorsPageQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return <VendorsPageFallback />;
  }

  return (
    <Suspense fallback={<VendorsPageFallback />}>
      <VendorsPageContent queryRef={queryRef} />
    </Suspense>
  );
}
