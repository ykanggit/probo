import { Suspense } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Card } from "@/components/ui/card";
import { Link, useParams } from "react-router";
import type { FrameworkListViewQuery as FrameworkListViewQueryType } from "./__generated__/FrameworkListViewQuery.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { FrameworkListViewSkeleton } from "./FrameworkListPage";
import { FrameworkImportDropdown } from "./ImportFrameworkDialog";

const FrameworkListViewQuery = graphql`
  query FrameworkListViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        frameworks(first: 100)
          @connection(key: "FrameworkListView_frameworks") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

function FrameworkListViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkListViewQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkListViewQuery, queryRef);
  const { organizationId } = useParams();
  const frameworks =
    data.organization?.frameworks?.edges?.map((edge) => edge?.node) ?? [];

  return (
    <PageTemplate
      title="Frameworks"
      description="Manage your compliance frameworks"
      actions={<FrameworkImportDropdown />}
    >
      <div className="space-y-6">
        <Card>
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <tbody className="[&_tr:last-child]:border-0">
                {frameworks.length === 0 ? (
                  <tr className="border-b transition-colors hover:bg-h-subte-bg/50 data-[state=selected]:bg-subtle-bg">
                    <td
                      colSpan={4}
                      className="text-center p-4 align-middle text-tertiary"
                    >
                      No frameworks found. Create or import one to get started.
                    </td>
                  </tr>
                ) : (
                  frameworks.map((framework) => (
                    <tr
                      key={framework.id}
                      className="border-b transition-colors hover:bg-h-subtle-bg/50 data-[state=selected]:bg-subtle-bg cursor-pointer"
                    >
                      <td className="p-4 align-middle">
                        <Link
                          to={`/organizations/${organizationId}/frameworks/${framework.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {framework.name}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
}

export default function FrameworkListView() {
  const { organizationId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<FrameworkListViewQueryType>(
    FrameworkListViewQuery,
  );

  if (!queryRef) {
    loadQuery({ organizationId: organizationId! });
    return <FrameworkListViewSkeleton />;
  }

  return (
    <Suspense fallback={<FrameworkListViewSkeleton />}>
      <FrameworkListViewContent queryRef={queryRef} />
    </Suspense>
  );
}
