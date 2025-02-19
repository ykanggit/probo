import { Suspense, useEffect, useState, useTransition } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  usePaginationFragment,
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
import { VendorListPageCreateVendorMutation } from "./__generated__/VendorListPageCreateVendorMutation.graphql";
import { VendorListPageDeleteVendorMutation } from "./__generated__/VendorListPageDeleteVendorMutation.graphql";
import { toast } from "@/hooks/use-toast";
import { VendorListPagePaginationQuery } from "./__generated__/VendorListPagePaginationQuery.graphql";
import { VendorListPage_vendors$key } from "./__generated__/VendorListPage_vendors.graphql";

const ITEMS_PER_PAGE = 25;

const vendorListPageQuery = graphql`
  query VendorListPageQuery(
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    currentOrganization: node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        ...VendorListPage_vendors
      }
    }
  }
`;

const vendorListFragment = graphql`
  fragment VendorListPage_vendors on Organization
  @refetchable(queryName: "VendorListPagePaginationQuery") {
    id
    vendors(first: $first, after: $after, last: $last, before: $before)
      @connection(key: "VendorListPage_vendors") {
      __id
      edges {
        node {
          id
          name
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const createVendorMutation = graphql`
  mutation VendorListPageCreateVendorMutation(
    $input: CreateVendorInput!
    $connections: [ID!]!
  ) {
    createVendor(input: $input) {
      vendorEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const deleteVendorMutation = graphql`
  mutation VendorListPageDeleteVendorMutation(
    $input: DeleteVendorInput!
    $connections: [ID!]!
  ) {
    deleteVendor(input: $input) {
      deletedVendorId @deleteEdge(connections: $connections)
    }
  }
`;

// TODO: Remove this once we have a real list of vendors
const vendorsList = [
  { id: "1", name: "Amazon Web Services", createdAt: new Date().toISOString() },
  {
    id: "2",
    name: "Google Cloud Platform",
    createdAt: new Date().toISOString(),
  },
  { id: "3", name: "Microsoft Azure", createdAt: new Date().toISOString() },
  { id: "4", name: "Salesforce", createdAt: new Date().toISOString() },
  { id: "5", name: "Slack", createdAt: new Date().toISOString() },
  { id: "6", name: "Zoom", createdAt: new Date().toISOString() },
  { id: "7", name: "Dropbox", createdAt: new Date().toISOString() },
  { id: "8", name: "Trello", createdAt: new Date().toISOString() },
  { id: "9", name: "Asana", createdAt: new Date().toISOString() },
  { id: "10", name: "Notion", createdAt: new Date().toISOString() },
  { id: "11", name: "GitHub", createdAt: new Date().toISOString() },
  { id: "12", name: "GitLab", createdAt: new Date().toISOString() },
  { id: "13", name: "Bitbucket", createdAt: new Date().toISOString() },
  { id: "14", name: "Docker", createdAt: new Date().toISOString() },
  { id: "15", name: "Kubernetes", createdAt: new Date().toISOString() },
  { id: "16", name: "Jenkins", createdAt: new Date().toISOString() },
  { id: "17", name: "CircleCI", createdAt: new Date().toISOString() },
];

function LoadAboveButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load above"}
      </Button>
    </div>
  );
}

function LoadBelowButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load below"}
      </Button>
    </div>
  );
}

function VendorListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorListPageQueryType>;
}) {
  const data = usePreloadedQuery<VendorListPageQueryType>(
    vendorListPageQuery,
    queryRef,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Array<any>>([]);
  const [createVendor] =
    useMutation<VendorListPageCreateVendorMutation>(createVendorMutation);
  const [deleteVendor] =
    useMutation<VendorListPageDeleteVendorMutation>(deleteVendorMutation);

  const {
    data: vendorsConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    VendorListPagePaginationQuery,
    VendorListPage_vendors$key
  >(vendorListFragment, data.currentOrganization);

  const vendors =
    vendorsConnection.vendors.edges.map((edge) => edge.node) ?? [];
  const pageInfo = vendorsConnection.vendors.pageInfo;

  const fuse = new Fuse(vendorsList, {
    keys: ["name"],
    threshold: 0.3,
  });

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
              <p className="text-sm text-muted-foreground">
                Search and add new vendors
              </p>
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
                    const results = fuse
                      .search(value)
                      .map((result) => result.item);
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
                            connections: [
                              vendorsConnection.vendors.__id,
                            ],
                            input: {
                              organizationId: data.currentOrganization.id,
                              name: vendor.name,
                              description: "",
                              serviceStartAt: new Date().toISOString(),
                              serviceCriticality: "LOW",
                              riskTier: "GENERAL",
                            },
                          },
                          onCompleted(response) {
                            setSearchTerm("");
                            setFilteredVendors([]);
                            toast({
                              title: "Vendor added",
                              description:
                                "The vendor has been added successfully",
                            });
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

      <LoadAboveButton
        isLoading={isLoadingPrevious}
        hasMore={hasPrevious}
        onLoadMore={() => {
          startTransition(() => {
            setSearchParams((prev) => {
              prev.set("before", pageInfo?.startCursor || "");
              prev.delete("after");
              return prev;
            });
            loadPrevious(ITEMS_PER_PAGE);
          });
        }}
      />

      <div className="space-y-2">
        {vendors.map((vendor) => (
          <div
            key={vendor?.id}
            className="block hover:bg-accent/50 transition-colors"
          >
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
                    <p className="text-sm font-medium leading-none">
                      {vendor?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vendor since{" "}
                      {new Date(vendor?.createdAt).toLocaleDateString()}
                    </p>
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
                    if (
                      window.confirm(
                        "Are you sure you want to delete this vendor?",
                      )
                    ) {
                      deleteVendor({
                        variables: {
                          connections: [
                            vendorsConnection.vendors.__id
                          ],
                          input: {
                            vendorId: vendor.id,
                          },
                        },
                        onCompleted() {
                          toast({
                            title: "Vendor deleted",
                            description:
                              "The vendor has been deleted successfully",
                          });
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
      </div>

      <LoadBelowButton
        isLoading={isLoadingNext}
        hasMore={hasNext}
        onLoadMore={() => {
          startTransition(() => {
            setSearchParams((prev) => {
              prev.set("after", pageInfo?.endCursor || "");
              prev.delete("before");
              return prev;
            });
            loadNext(ITEMS_PER_PAGE);
          });
        }}
      />
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
  const [queryRef, loadQuery] =
    useQueryLoader<VendorListPageQueryType>(vendorListPageQuery);

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    loadQuery({
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery]);

  if (!queryRef) {
    return <VendorListFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Vendors - Probo Console</title>
      </Helmet>
      <Suspense fallback={<VendorListFallback />}>
        <VendorListContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
