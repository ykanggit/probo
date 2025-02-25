import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Link } from "react-router";
import type { HomePageQuery as HomePageQueryType } from "./__generated__/HomePageQuery.graphql";

export const HomePageQuery = graphql`
  query HomePageQuery {
    viewer {
      id
      organizations {
        name
        createdAt
        updatedAt
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
        frameworks {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              name
              description
              controls {
                edges {
                  node {
                    id
                    name
                    state
                    stateTransisions {
                      edges {
                        node {
                          id
                          toState
                          fromState
                          createdAt
                          updatedAt
                        }
                      }
                    }
                    tasks {
                      edges {
                        node {
                          id
                          name
                          state
                          evidences {
                            edges {
                              node {
                                id
                                state
                                fileUrl
                                stateTransisions {
                                  edges {
                                    node {
                                      id
                                      fromState
                                      toState
                                      reason
                                      createdAt
                                      updatedAt
                                    }
                                  }
                                }
                                createdAt
                                updatedAt
                              }
                            }
                          }
                          stateTransisions {
                            edges {
                              node {
                                id
                                toState
                                fromState
                                reason
                                createdAt
                                updatedAt
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
            }
          }
        }
      }
    }
  }
`;

export default function HomePage() {
  const [queryRef, loadQuery] =
    useQueryLoader<HomePageQueryType>(HomePageQuery);

  useEffect(() => loadQuery({}), [loadQuery]);

  if (!queryRef) {
    return <HomePageFallback />;
  }

  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent queryRef={queryRef} />
    </Suspense>
  );
}

function HomePageFallback() {
  return <div>Loading...</div>;
}

function HomePageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<HomePageQueryType>;
}) {
  const data = usePreloadedQuery(HomePageQuery, queryRef);

  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <Link to="/foobar">Go to FooPage</Link>
      </div>
    </div>
  );
}
