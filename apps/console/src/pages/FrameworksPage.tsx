import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Globe2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FrameworksPageQuery as FrameworksPageQueryType } from "./__generated__/FrameworksPageQuery.graphql";

const FrameworksPageQuery = graphql`
  query FrameworksPageQuery {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        frameworks {
          edges {
            node {
              id
              name
              description
              controls {
                edges {
                  node {
                    id
                    state
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

function FrameworksPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworksPageQueryType>;
}) {
  const data = usePreloadedQuery(FrameworksPageQuery, queryRef);
  const frameworks = data.node.frameworks?.edges.map(edge => edge?.node) ?? [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Framework</h1>
        <p className="text-muted-foreground">
          Compliance frameworks like SOC 2 and ISO 27001 provide guidelines to secure sensitive data, manage risks, and
          build trust. SOC 2 focuses on customer data protection via five Trust Principles, while ISO 27001 establishes
          a comprehensive Information Security Management System for global standards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {frameworks.map((framework) => (
          <Card key={framework?.id} className="bg-card/50">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Badge className="absolute right-0 top-0 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  Active
                </Badge>
                <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                  <Globe2 className="w-12 h-12 text-green-500" />
                  <div className="absolute text-xs font-medium text-green-500">{framework?.name}</div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{framework?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {framework?.description}
                </p>
              </div>
              <div className="flex items-center text-muted-foreground text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {framework?.controls?.edges.length} Controls
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FrameworksPageFallback() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="bg-muted w-24 h-24 rounded-full animate-pulse mb-4" />
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-20 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FrameworksPage() {
  const [queryRef, loadQuery] = useQueryLoader<FrameworksPageQueryType>(FrameworksPageQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <Suspense fallback={<FrameworksPageFallback />}>
      {queryRef && <FrameworksPageContent queryRef={queryRef} />}
    </Suspense>
  );
}
