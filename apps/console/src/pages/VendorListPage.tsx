import { Suspense, useEffect, useState, useTransition } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { useSearchParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Globe, Shield, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Fuse from "fuse.js";
import type { VendorListPageQuery as VendorListPageQueryType } from "./__generated__/VendorListPageQuery.graphql";
import { Helmet } from "react-helmet-async";
const ITEMS_PER_PAGE = 20;

const vendorListPageQuery = graphql`
  query VendorListPageQuery($first: Int, $after: CursorKey, $last: Int, $before: CursorKey) {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        vendors(first: $first, after: $after, last: $last, before: $before) {
          edges {
            node {
              id
              name
              createdAt
              updatedAt
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
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

const deleteVendorMutation = graphql`
  mutation VendorListPageDeleteVendorMutation($input: DeleteVendorInput!) {
    deleteVendor(input: $input)
  }
`;

// TODO: Remove this once we have a real list of vendors
const vendorsList = [
  { id: '1', name: 'Amazon Web Services', createdAt: new Date().toISOString() },
  { id: '2', name: 'Google Cloud Platform', createdAt: new Date().toISOString() },
  { id: '3', name: 'Microsoft Azure', createdAt: new Date().toISOString() },
  { id: '4', name: 'Salesforce', createdAt: new Date().toISOString() },
  { id: '5', name: 'Slack', createdAt: new Date().toISOString() },
  { id: '6', name: 'Zoom', createdAt: new Date().toISOString() },
  { id: '7', name: 'Dropbox', createdAt: new Date().toISOString() },
  { id: '8', name: 'Trello', createdAt: new Date().toISOString() },
  { id: '9', name: 'Asana', createdAt: new Date().toISOString() },
  { id: '10', name: 'Notion', createdAt: new Date().toISOString() },
  { id: '11', name: 'GitHub', createdAt: new Date().toISOString() },
  { id: '12', name: 'GitLab', createdAt: new Date().toISOString() },
  { id: '13', name: 'Bitbucket', createdAt: new Date().toISOString() },
  { id: '14', name: 'Docker', createdAt: new Date().toISOString() },
  { id: '15', name: 'Kubernetes', createdAt: new Date().toISOString() },
  { id: '16', name: 'Jenkins', createdAt: new Date().toISOString() },
  { id: '17', name: 'CircleCI', createdAt: new Date().toISOString() },
];

type LoadQueryType = ReturnType<typeof useQueryLoader<VendorListPageQueryType>>[1];

function VendorListContent({
  queryRef,
  onPageChange,
  loadQuery
}: {
  queryRef: PreloadedQuery<VendorListPageQueryType>;
  onPageChange: (params: { first?: number; after?: string; last?: number; before?: string }) => void;
  loadQuery: LoadQueryType;
}) {
  const data = usePreloadedQuery(vendorListPageQuery, queryRef);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Array<any>>([]);
  const [createVendor] = useMutation(createVendorMutation);
  const [deleteVendor] = useMutation(deleteVendorMutation);

  const vendors = data.node?.vendors?.edges?.map(edge => edge?.node) ?? [];
  const pageInfo = data.node?.vendors?.pageInfo;

  const fuse = new Fuse(vendorsList, {
    keys: ['name'],
    threshold: 0.3,
  });

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (!pageInfo) return;
    
    if (direction === 'next' && !pageInfo.hasNextPage) return;
    if (direction === 'prev' && !pageInfo.hasPreviousPage) return;
    
    startTransition(() => {
      const params = direction === 'next' 
        ? { first: ITEMS_PER_PAGE, after: pageInfo.endCursor }
        : { last: ITEMS_PER_PAGE, before: pageInfo.startCursor };

      setSearchParams(prev => {
        if (direction === 'next') {
          prev.set('after', pageInfo.endCursor!);
          prev.delete('before');
        } else {
          prev.set('before', pageInfo.startCursor!);
          prev.delete('after');
        }
        return prev;
      });

      onPageChange(params);
    });
  };

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
                            loadQuery({ 
                              first: ITEMS_PER_PAGE,
                              after: undefined,
                              last: undefined,
                              before: undefined,
                            }, { fetchPolicy: 'network-only' });
                          },
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span>{vendor.name}</span>
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
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <Link 
                to={`/vendors/${vendor?.id}`}
                className="flex items-center gap-4 flex-1"
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
              </Link>
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Are you sure you want to delete this vendor?')) {
                      deleteVendor({
                        variables: {
                          input: {
                            vendorId: vendor.id
                          }
                        },
                        onCompleted() {
                          loadQuery({ 
                            first: ITEMS_PER_PAGE,
                            after: undefined,
                            last: undefined,
                            before: undefined,
                          }, { fetchPolicy: 'network-only' });
                        },
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange('prev')}
            disabled={isPending || !pageInfo?.hasPreviousPage}
          >
            {isPending ? "Loading..." : "Previous"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange('next')}
            disabled={isPending || !pageInfo?.hasNextPage}
          >
            {isPending ? "Loading..." : "Next"}
          </Button>
        </div>
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
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] = useQueryLoader<VendorListPageQueryType>(vendorListPageQuery);

  // Initialize with URL params
  useEffect(() => {
    const after = searchParams.get('after');
    const before = searchParams.get('before');
    
    loadQuery({ 
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery, searchParams]);

  const handlePageChange = ({ first, after, last, before }: { first?: number; after?: string; last?: number; before?: string }) => {
    loadQuery(
      { 
        first,
        after,
        last,
        before,
      },
      { fetchPolicy: 'network-only' }
    );
  };

  if (!queryRef) {
    return <VendorListFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Vendors - Probo Console</title>
      </Helmet>
      <Suspense fallback={<VendorListFallback />}>
        <VendorListContent 
          queryRef={queryRef} 
          onPageChange={handlePageChange}
          loadQuery={loadQuery} 
        />
      </Suspense>
    </>
  );
}
