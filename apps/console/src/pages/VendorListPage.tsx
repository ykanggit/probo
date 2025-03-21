import { Suspense, useEffect, useState, useTransition } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  usePaginationFragment,
} from "react-relay";
import { useSearchParams, useParams } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Store, ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Fuse from "fuse.js";
import type { VendorListPageQuery as VendorListPageQueryType } from "./__generated__/VendorListPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import { VendorListPageCreateVendorMutation } from "./__generated__/VendorListPageCreateVendorMutation.graphql";
import { VendorListPageDeleteVendorMutation } from "./__generated__/VendorListPageDeleteVendorMutation.graphql";
import { VendorListPagePaginationQuery } from "./__generated__/VendorListPagePaginationQuery.graphql";
import { VendorListPage_vendors$key } from "./__generated__/VendorListPage_vendors.graphql";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";

const ITEMS_PER_PAGE = 25;

const vendorListPageQuery = graphql`
  query VendorListPageQuery(
    $organizationId: ID!
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    organization: node(id: $organizationId) {
      id

      ...VendorListPage_vendors
        @arguments(first: $first, after: $after, last: $last, before: $before)
    }
  }
`;

const vendorListFragment = graphql`
  fragment VendorListPage_vendors on Organization
  @refetchable(queryName: "VendorListPagePaginationQuery")
  @argumentDefinitions(
    first: { type: "Int" }
    after: { type: "CursorKey" }
    last: { type: "Int" }
    before: { type: "CursorKey" }
  ) {
    vendors(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: { direction: ASC, field: NAME }
    ) @connection(key: "VendorListPage_vendors") {
      __id
      edges {
        node {
          id
          name
          description
          createdAt
          updatedAt
          riskTier
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
          description
          createdAt
          updatedAt
          riskTier
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

// Define a proper type for the vendor items
interface VendorItem {
  id: string;
  name: string;
  createdAt: string;
}

// TODO: Remove this once we have a real list of vendors
const vendorsList: VendorItem[] = [
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
  if (!hasMore) {
    return null;
  }

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
  if (!hasMore) {
    return null;
  }

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
  const { toast } = useToast();
  const data = usePreloadedQuery<VendorListPageQueryType>(
    vendorListPageQuery,
    queryRef
  );
  const [, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<VendorItem[]>([]);
  const [createVendor] =
    useMutation<VendorListPageCreateVendorMutation>(createVendorMutation);
  const [deleteVendor] =
    useMutation<VendorListPageDeleteVendorMutation>(deleteVendorMutation);
  const { organizationId } = useParams();

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
  >(vendorListFragment, data.organization);

  const vendors =
    vendorsConnection.vendors.edges.map((edge) => edge.node) ?? [];
  const pageInfo = vendorsConnection.vendors.pageInfo;

  const fuse = new Fuse(vendorsList, {
    keys: ["name"],
    threshold: 0.3,
  });

  return (
    <>
      <Helmet>
        <title>Vendors - Probo</title>
      </Helmet>
      <div className="space-y-6">
        <PageHeader
          className="mb-17"
          title="Vendors"
          description="Vendors are third-party services that your company uses. Add them to
            keep track of their risk and compliance status."
        />

        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5" />
            <h3 className="font-medium">Add a vendor</h3>
          </div>
          <div className="flex gap-2 relative">
            <Input
              type="text"
              placeholder="Type vendor's name"
              value={searchTerm}
              style={{ borderRadius: "0.3rem" }}
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

            {searchTerm.trim() !== "" && (
              <>
                {filteredVendors.length > 0 ? (
                  <div
                    style={{ borderRadius: "0.3rem" }}
                    className="absolute top-full left-0 mt-1 w-[calc(100%-100px)] max-h-48 overflow-y-auto border bg-popover shadow-md z-10"
                  >
                    {filteredVendors.map((vendor: VendorItem) => (
                      <button
                        key={vendor.id}
                        className="w-full px-3 py-2 text-left hover:bg-accent"
                        onClick={() => {
                          createVendor({
                            variables: {
                              connections: [vendorsConnection.vendors.__id],
                              input: {
                                organizationId: data.organization.id,
                                name: vendor.name,
                                description: "",
                                serviceStartAt: new Date().toISOString(),
                                serviceCriticality: "LOW",
                                riskTier: "GENERAL",
                              },
                            },
                            onCompleted() {
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
                        {vendor.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{ borderRadius: "0.3rem" }}
                    className="absolute top-full left-0 mt-1 w-[calc(100%-100px)] border bg-popover shadow-md z-10"
                  >
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2"
                      onClick={() => {
                        createVendor({
                          variables: {
                            connections: [vendorsConnection.vendors.__id],
                            input: {
                              organizationId: data.organization.id,
                              name: searchTerm.trim(),
                              description: "",
                              serviceStartAt: new Date().toISOString(),
                              serviceCriticality: "LOW",
                              riskTier: "GENERAL",
                            },
                          },
                          onCompleted() {
                            setSearchTerm("");
                            setFilteredVendors([]);
                            toast({
                              title: "Vendor created",
                              description:
                                "The new vendor has been created successfully",
                            });
                          },
                        });
                      }}
                    >
                      <span className="font-medium">Create new vendor:</span>{" "}
                      {searchTerm}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {vendors.map((vendor) => (
            <Link
              key={vendor?.id}
              to={`/organizations/${organizationId}/vendors/${vendor?.id}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{vendor?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{vendor?.name}</p>
                    {vendor?.description && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          {vendor.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      vendor.riskTier === "CRITICAL"
                        ? "bg-red-100 text-red-900 rounded-full px-3 py-0.5 text-xs font-medium"
                        : vendor?.riskTier === "SIGNIFICANT"
                        ? "bg-yellow-100 text-yellow-900 rounded-full px-3 py-0.5 text-xs font-medium"
                        : "bg-green-100 text-green-900 rounded-full px-3 py-0.5 text-xs font-medium"
                    }
                  >
                    {vendor.riskTier}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:[&>svg]:text-destructive"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      if (
                        window.confirm(
                          "Are you sure you want to delete this vendor?"
                        )
                      ) {
                        deleteVendor({
                          variables: {
                            connections: [vendorsConnection.vendors.__id],
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
                    <Trash2 className="h-4 w-4 transition-colors" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
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
    </>
  );
}

function VendorListFallback() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-1" />
      </div>
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function VendorListPage() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<VendorListPageQueryType>(vendorListPageQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    loadQuery({
      organizationId: organizationId!,
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery, organizationId]);

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
