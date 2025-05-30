import { Suspense, useEffect, useTransition, useRef } from "react";
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
import { Box, Plus, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import type { AssetsListViewQuery as AssetsListViewQueryType } from "./__generated__/AssetsListViewQuery.graphql";
import type { AssetsListViewDeleteAssetMutation } from "./__generated__/AssetsListViewDeleteAssetMutation.graphql";
import { AssetsListViewPaginationQuery } from "./__generated__/AssetsListViewPaginationQuery.graphql";
import { AssetsListView_assets$key } from "./__generated__/AssetsListView_assets.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { AssetsListViewSkeleton } from "./AssetsListViewSkeleton";
import { BreadCrumb } from "../OrganizationBreadcrumb";

const ITEMS_PER_PAGE = 25;

const assetsListViewQuery = graphql`
  query AssetsListViewQuery(
    $organizationId: ID!
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    organization: node(id: $organizationId) {
      ...AssetsListView_assets
        @arguments(first: $first, after: $after, last: $last, before: $before)
    }
  }
`;

const assetsListFragment = graphql`
  fragment AssetsListView_assets on Organization
  @refetchable(queryName: "AssetsListViewPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int" }
    after: { type: "CursorKey" }
    last: { type: "Int" }
    before: { type: "CursorKey" }
  ) {
    id
    assets(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: { direction: ASC, field: AMOUNT }
    ) @connection(key: "AssetsListView_assets") {
      __id
      edges {
        node {
          id
          name
          amount
          criticity
          assetType
          dataTypesStored
          owner {
            id
            fullName
          }
          vendors {
            edges {
              node {
                id
                name
              }
            }
          }
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

const deleteAssetMutation = graphql`
  mutation AssetsListViewDeleteAssetMutation(
    $input: DeleteAssetInput!
    $connections: [ID!]!
  ) {
    deleteAsset(input: $input) {
      deletedAssetId @deleteEdge(connections: $connections)
    }
  }
`;

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
        disabled={isLoading}
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

function AssetsListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<AssetsListViewQueryType>;
}) {
  const data = usePreloadedQuery<AssetsListViewQueryType>(
    assetsListViewQuery,
    queryRef,
  );
  const [, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  const [deleteAsset] =
    useMutation<AssetsListViewDeleteAssetMutation>(deleteAssetMutation);
  const { organizationId } = useParams();
  const isPaginationUpdate = useRef(false);

  const {
    data: assetsConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    AssetsListViewPaginationQuery,
    AssetsListView_assets$key
  >(assetsListFragment, data.organization);

  const assets = assetsConnection.assets.edges.map((edge) => edge.node) ?? [];
  const pageInfo = assetsConnection.assets.pageInfo;

  return (
    <>
      <PageTemplate
        title="Assets"
        description="Keep track of your organization's assets and their criticality levels."
        actions={
          <Button asChild variant="secondary" className="gap-2">
            <Link to={`/organizations/${organizationId}/assets/new`}>
              <Plus className="h-4 w-4" />
              Add an asset
            </Link>
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {assets.map((asset) => (
              <Link
                key={asset?.id}
                to={`/organizations/${organizationId}/assets/${asset?.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-4 rounded-xl border bg-level-1 hover:bg-accent-bg/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Box className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                        {asset?.name} ({asset?.amount})
                        </p>
                        {asset?.owner?.fullName && (
                          <>
                            <span className="text-tertiary">•</span>
                            <p className="text-sm text-tertiary">
                              Owned by {asset.owner.fullName}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-tertiary">
                        Data types: {asset?.dataTypesStored}
                      </div>
                      <div className="text-sm text-tertiary">
                        {asset?.vendors?.edges?.length > 0 && (
                          <>
                            <p className="text-sm text-tertiary">
                              Vendors: {asset.vendors.edges.map(edge => edge?.node?.name).join(", ")}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="px-3 py-0.5 text-xs font-medium">
                      {asset?.assetType === "PHYSICAL" ? "Physical" : "Virtual"}
                    </Badge>
                    <Badge
                      variant={
                        asset?.criticity === "HIGH"
                          ? "destructive"
                          : asset?.criticity === "MEDIUM"
                          ? "warning"
                          : asset?.criticity === "LOW"
                          ? "success"
                          : "default"
                      }
                      className="px-3 py-0.5 text-xs font-medium"
                    >
                      {asset?.criticity}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-tertiary hover:bg-transparent hover:[&>svg]:text-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this asset?",
                          )
                        ) {
                          deleteAsset({
                            variables: {
                              connections: [assetsConnection.assets.__id],
                              input: {
                                assetId: asset.id,
                              },
                            },
                          });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 transition-colors" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-tertiary" />
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
                isPaginationUpdate.current = true;
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
                isPaginationUpdate.current = true;
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
      </PageTemplate>
    </>
  );
}

export default function AssetsListView() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<AssetsListViewQueryType>(assetsListViewQuery);
  const { organizationId } = useParams();
  const isPaginationUpdate = useRef(false);

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    // Skip the query if this was triggered by pagination
    if (isPaginationUpdate.current) {
      isPaginationUpdate.current = false;
      return;
    }

    loadQuery({
      organizationId: organizationId!,
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery, organizationId, searchParams]);

  if (!queryRef) {
    return <AssetsListViewSkeleton />;
  }

  return (
    <Suspense fallback={<AssetsListViewSkeleton />}>
      <AssetsListContent queryRef={queryRef} />
    </Suspense>
  );
}
