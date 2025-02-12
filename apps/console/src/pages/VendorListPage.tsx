import { Suspense, useEffect, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  loadQuery,
  useLazyLoadQuery,
} from "react-relay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Globe, Shield, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Fuse from "fuse.js";
import type { VendorListPageQuery as VendorListPageQueryType } from "./__generated__/VendorListPageQuery.graphql";

const vendorListPageQuery = graphql`
  query VendorListPageQuery {
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

const createVendorMutation = graphql`
  mutation VendorListPageCreateVendorMutation($input: CreateVendorInput!) {
    createVendor(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

// TODO: Remove this once we have a real list of vendors
const vendorsList = [
  { id: '1', name: 'Amazon Web Services', createdAt: new Date().toISOString() },
  { id: '2', name: 'Google Cloud Platform', createdAt: new Date().toISOString() },
  { id: '3', name: 'Microsoft Azure', createdAt: new Date().toISOString() },
  { id: '4', name: 'Salesforce', createdAt: new Date().toISOString() },
  { id: '5', name: 'Slack', createdAt: new Date().toISOString() },
];

function VendorListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorListPageQueryType>;
}) {
  const data = usePreloadedQuery(vendorListPageQuery, queryRef);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Array<typeof vendorsList[0]>>([]);
  const [createVendor] = useMutation(createVendorMutation);
  const [_, loadQuery] = useQueryLoader<VendorListPageQueryType>(vendorListPageQuery);
  const fuse = new Fuse<typeof vendorsList[0]>(vendorsList, {
    keys: ['name'],
    threshold: 0.3,
  });

  const vendors = data.node.vendors?.edges.map(edge => edge.node) ?? [];

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
            <div className="flex flex-col gap-3 relative">
              <Input
                type="text"
                placeholder="Type vendor's name"
                className="w-64"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim() === "") {
                    setFilteredVendors([]);
                  } else {
                    const results = fuse.search(value).map(result => result.item);
                    setFilteredVendors(results);
                  }
                }}
              />
              {searchTerm.trim() !== "" && filteredVendors.length > 0 && (
                <div className="absolute top-full mt-1 w-64 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg z-10">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor?.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        createVendor({
                          variables: {
                            input: {
                              organizationId: data.node.id,
                              name: vendor.name
                            }
                          },
                          onCompleted(response: any) {
                            setSearchTerm("");
                            setFilteredVendors([]);
                            loadQuery({}, {fetchPolicy: 'network-only'});
                          },
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span>{vendor?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <div key={vendor?.id} className="block hover:bg-accent/50 transition-colors">
            <Link 
              to={`/vendors/${vendor?.id}`}
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
            </Link>
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

export default function VendorListPage() {
  const [queryRef, loadQuery] = useQueryLoader<VendorListPageQueryType>(vendorListPageQuery);

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
