import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Globe, Shield, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { VendorListQuery as VendorListQueryType } from "./__generated__/VendorListQuery.graphql";

const VendorListQuery = graphql`
  query VendorListQuery {
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

function VendorListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorListQueryType>;
}) {
  const data = usePreloadedQuery(VendorListQuery, queryRef);
  const vendors = data.node.vendors?.edges.map(edge => edge?.node) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Vendors</h2>
        <p className="text-sm text-muted-foreground">
          Keep track of your company's vendors and their compliance status.
        </p>
      </div>

      <div className="rounded-lg border p-4 shadow-sm bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>+</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Add a vendor</p>
              <p className="text-sm text-muted-foreground">Search and add new vendors</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Type vendor's name"
                className="w-64"
              />
              <Button variant="secondary">
                Search
                <span className="ml-2">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {vendors.map((vendor) => (
          <div
            key={vendor?.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{vendor?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{vendor?.name}</p>
                <p className="text-sm text-muted-foreground">Vendor since {new Date(vendor?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-medium">
                Active
              </Badge>
              <div className="flex gap-1">
                <CircleUser className="h-4 w-4 text-muted-foreground" />
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                Not assessed
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorListFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function VendorList() {
  const [queryRef, loadQuery] = useQueryLoader<VendorListQueryType>(VendorListQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return <VendorListFallback />;
  }

  return (
    <Suspense fallback={<VendorListFallback />}>
      <VendorListContent queryRef={queryRef} />
    </Suspense>
  );
}
