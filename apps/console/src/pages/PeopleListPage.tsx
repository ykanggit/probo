import { Suspense, useEffect, useTransition } from "react";
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
import { CircleUser, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import type { PeopleListPageQuery as PeopleListPageQueryType } from "./__generated__/PeopleListPageQuery.graphql";

const ITEMS_PER_PAGE = 25;

const PeopleListPageQuery = graphql`
  query PeopleListPageQuery(
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        peoples(first: $first, after: $after, last: $last, before: $before)
          @connection(key: "PeopleListPageQuery_peoples") {
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

const deletePeopleMutation = graphql`
  mutation PeopleListPageDeletePeopleMutation($input: DeletePeopleInput!) {
    deletePeople(input: $input)
  }
`;

function LoadAboveButton({
  pageInfo,
  isPending,
  onPageChange,
}: {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null | undefined;
  isPending: boolean;
  onPageChange: (direction: "prev") => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={() => onPageChange("prev")}
        disabled={isPending || !pageInfo?.hasPreviousPage}
        className="w-full"
      >
        {isPending ? "Loading..." : "Load above"}
      </Button>
    </div>
  );
}

function LoadBelowButton({
  pageInfo,
  isPending,
  onPageChange,
}: {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null | undefined;
  isPending: boolean;
  onPageChange: (direction: "next") => void;
}) {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={() => onPageChange("next")}
        disabled={isPending || !pageInfo?.hasNextPage}
        className="w-full"
      >
        {isPending ? "Loading..." : "Load below"}
      </Button>
    </div>
  );
}

function PeopleListPageContent({
  queryRef,
  onPageChange,
}: {
  queryRef: PreloadedQuery<PeopleListPageQueryType>;
  onPageChange: (params: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }) => void;
}) {
  const data = usePreloadedQuery(PeopleListPageQuery, queryRef);
  const [searchParams, setSearchParams] = useSearchParams();
  const peoples = data.node.peoples?.edges.map((edge) => edge?.node) ?? [];
  const pageInfo = data.node.peoples?.pageInfo;
  const [isPending, startTransition] = useTransition();
  const [deletePeople] = useMutation(deletePeopleMutation);

  const handlePageChange = (direction: "prev" | "next") => {
    if (!pageInfo) return;

    if (direction === "next" && !pageInfo.hasNextPage) return;
    if (direction === "prev" && !pageInfo.hasPreviousPage) return;

    startTransition(() => {
      const params =
        direction === "next"
          ? { first: ITEMS_PER_PAGE, after: pageInfo.endCursor }
          : { last: ITEMS_PER_PAGE, before: pageInfo.startCursor };

      setSearchParams((prev) => {
        if (direction === "next") {
          prev.set("after", pageInfo.endCursor!);
          prev.delete("before");
        } else {
          prev.set("before", pageInfo.startCursor!);
          prev.delete("after");
        }
        return prev;
      });

      onPageChange(params);
    });
  };

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
        pageInfo={pageInfo}
        isPending={isPending}
        onPageChange={() => handlePageChange("prev")}
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
                        input: {
                          peopleId: person.id,
                        },
                      },
                      onCompleted() {
                        onPageChange({
                          first: ITEMS_PER_PAGE,
                          after: undefined,
                          last: undefined,
                          before: undefined,
                        });
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

        <LoadBelowButton
          pageInfo={pageInfo}
          isPending={isPending}
          onPageChange={() => handlePageChange("next")}
        />
      </div>
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

type LoadQueryType = ReturnType<
  typeof useQueryLoader<PeopleListPageQueryType>
>[1];

export default function PeopleListPage() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<PeopleListPageQueryType>(PeopleListPageQuery);

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    loadQuery({
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery, searchParams]);

  const handlePageChange = ({
    first,
    after,
    last,
    before,
  }: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }) => {
    loadQuery(
      {
        first,
        after,
        last,
        before,
      },
      { fetchPolicy: "network-only" },
    );
  };

  if (!queryRef) {
    return <PeopleListPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>People - Probo Console</title>
      </Helmet>
      <Suspense fallback={<PeopleListPageFallback />}>
        <PeopleListPageContent
          queryRef={queryRef}
          onPageChange={handlePageChange}
        />
      </Suspense>
    </>
  );
}
