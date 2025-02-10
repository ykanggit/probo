import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Globe, Shield } from "lucide-react";
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
  const peoples = data.node.peoples?.edges.map(edge => edge?.node) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Employees</h2>
        <p className="text-sm text-muted-foreground">
          Keep track of your company's workforce and their progress towards completing tasks assigned to them.
        </p>
      </div>
      <div className="space-y-2">
        {peoples.map((person) => (
          <div
            key={person?.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{person?.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{person?.fullName}</p>
                <p className="text-sm text-muted-foreground">{person?.primaryEmailAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-medium">
                Admin
              </Badge>
              <div className="flex gap-1">
                <CircleUser className="h-4 w-4 text-muted-foreground" />
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                Not onboarded
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeoplesPageFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1,2,3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              <div className="flex gap-1">
                {[1,2,3].map((j) => (
                  <div key={j} className="h-4 w-4 bg-muted animate-pulse rounded" />
                ))}
              </div>
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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