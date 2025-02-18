"use client";

import { Card } from "@/components/ui/card";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Suspense, useEffect } from "react";
import type { PeopleOverviewPageQuery as PeopleOverviewPageQueryType } from "./__generated__/PeopleOverviewPageQuery.graphql";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

const peopleOverviewPageQuery = graphql`
  query PeopleOverviewPageQuery($peopleId: ID!) {
    node(id: $peopleId) {
      ... on People {
        id
        fullName
        primaryEmailAddress
        createdAt
        updatedAt
      }
    }
  }
`;

function PeopleOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PeopleOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(peopleOverviewPageQuery, queryRef);
  const { setBreadcrumbSegment } = useBreadcrumb();

  useEffect(() => {
    if (data.node?.primaryEmailAddress) {
      setBreadcrumbSegment('peoples/:id', data.node.primaryEmailAddress);
    }
  }, [data.node?.primaryEmailAddress, setBreadcrumbSegment]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {data.node?.fullName}
          </h1>
          <p className="text-gray-600">
            View and manage person details
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Personal Information</h2>
              <p className="text-sm text-gray-500">
                Basic information about the person
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1">{data.node?.fullName}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1">{data.node?.primaryEmailAddress}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">System Information</h2>
              <p className="text-sm text-gray-500">
                System-related information about the person
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1">{new Date(data.node?.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1">{new Date(data.node?.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PeopleOverviewPageFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function PeopleOverviewPage() {
  const { peopleId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<PeopleOverviewPageQueryType>(
    peopleOverviewPageQuery,
  );

  useEffect(() => {
    loadQuery({ peopleId: peopleId! });
  }, [loadQuery, peopleId]);

  if (!queryRef) {
    return <PeopleOverviewPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>People Overview - Probo Console</title>
      </Helmet>
      <Suspense fallback={<PeopleOverviewPageFallback />}>
        <PeopleOverviewPageContent queryRef={queryRef} />
      </Suspense>
    </>
  );
} 