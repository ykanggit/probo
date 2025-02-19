import { Suspense, useEffect, useTransition } from "react";
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
import { CircleUser, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import type { PeopleListPageQuery as PeopleListPageQueryType } from "./__generated__/PeopleListPageQuery.graphql";
import { PeopleListPagePaginationQuery } from "./__generated__/PeopleListPagePaginationQuery.graphql";
import { PeopleListPage_peoples$key } from "./__generated__/PeopleListPage_peoples.graphql";

const ITEMS_PER_PAGE = 25;

const peopleListPageQuery = graphql`
  query PeopleListPageQuery(
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    currentOrganization: node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        ...PeopleListPage_peoples
      }
    }
  }
`;

const peopleListFragment = graphql`
  fragment PeopleListPage_peoples on Organization
  @refetchable(queryName: "PeopleListPagePaginationQuery") {
    id
    peoples(first: $first, after: $after, last: $last, before: $before)
      @connection(key: "PeopleListPage_peoples") {
      __id
      edges {
        node {
          id
          fullName
          primaryEmailAddress
          additionalEmailAddresses
          kind
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

const deletePeopleMutation = graphql`
  mutation PeopleListPageDeletePeopleMutation(
    $input: DeletePeopleInput!
    $connections: [ID!]!
  ) {
    deletePeople(input: $input) {
      deletedPeopleId @deleteEdge(connections: $connections)
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

function PeopleListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PeopleListPageQueryType>;
}) {
  const data = usePreloadedQuery<PeopleListPageQueryType>(
    peopleListPageQuery,
    queryRef,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletePeople] = useMutation(deletePeopleMutation);

  const {
    data: peoplesConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    PeopleListPagePaginationQuery,
    PeopleListPage_peoples$key
  >(peopleListFragment, data.currentOrganization);

  const peoples = peoplesConnection.peoples.edges.map((edge) => edge.node) ?? [];
  const pageInfo = peoplesConnection.peoples.pageInfo;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">People</h2>
            <p className="text-sm text-muted-foreground">
              Manage your organization's people.
            </p>
          </div>
          <Button asChild>
            <Link to="/peoples/create">Create People</Link>
          </Button>
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
        {peoples.map((person) => (
          <Link
            key={person?.id}
            to={`/peoples/${person?.id}`}
            className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent/50"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{person?.fullName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {person?.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {person?.primaryEmailAddress}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="font-medium">
                {person?.kind === "EMPLOYEE"
                  ? "Employee"
                  : person?.kind === "CONTRACTOR"
                    ? "Contractor"
                    : "Vendor"}
              </Badge>
              <div className="flex gap-1">
                <CircleUser className="h-4 w-4 text-muted-foreground" />
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-muted-foreground">
                Not onboarded
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    window.confirm(
                      "Are you sure you want to delete this person?",
                    )
                  ) {
                    deletePeople({
                      variables: {
                        connections: [peoplesConnection.peoples.__id],
                        input: {
                          peopleId: person.id,
                        },
                      },
                    });
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </Link>
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

function PeopleListPageFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
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
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-4 w-4 bg-muted animate-pulse rounded"
                  />
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

export default function PeopleListPage() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<PeopleListPageQueryType>(peopleListPageQuery);

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
    return <PeopleListPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>People - Probo Console</title>
      </Helmet>
      <Suspense fallback={<PeopleListPageFallback />}>
        <PeopleListContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
