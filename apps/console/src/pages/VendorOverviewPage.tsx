"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HelpCircle, ArrowUpRight } from "lucide-react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Suspense, useEffect, useState } from "react";
import type { VendorOverviewPageQuery as VendorOverviewPageQueryType } from "./__generated__/VendorOverviewPageQuery.graphql";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { cn } from "@/lib/utils";

const vendorOverviewPageQuery = graphql`
  query VendorOverviewPageQuery($vendorId: ID!) {
    node(id: $vendorId) {
      ... on Vendor {
        id
        name
        description
        serviceStartDate
        serviceTerminationDate
        serviceCriticality
        riskTier
        statusPageUrl
        createdAt
        updatedAt
      }
    }
  }
`;

function VendorOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(vendorOverviewPageQuery, queryRef);
  const { setBreadcrumbSegment } = useBreadcrumb();
  const [selectedCriticality, setSelectedCriticality] = useState(data.node.serviceCriticality);
  const [selectedRiskTier, setSelectedRiskTier] = useState(data.node.riskTier);

  useEffect(() => {
    if (data.node?.name) {
      setBreadcrumbSegment("vendors/:id", data.node.name);
    }
  }, [data.node?.name, setBreadcrumbSegment]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {data.node.name}
          </h1>
          <p className="text-gray-600">{data.node.description}</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Service Information</h2>
              <p className="text-sm text-gray-500">
                Basic information about the vendor service
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Service Start Date</Label>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(data.node.serviceStartDate).toLocaleDateString()}
                </p>
              </div>

              {data.node?.serviceTerminationDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <Label className="text-sm">Service Termination Date</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(data.node.serviceTerminationDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Service Criticality</Label>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedCriticality('LOW')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedCriticality === 'LOW'
                        ? "bg-green-100 text-green-900 ring-2 ring-green-600 ring-offset-2" 
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    Low
                  </button>
                  <button 
                    onClick={() => setSelectedCriticality('MEDIUM')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedCriticality === 'MEDIUM'
                        ? "bg-yellow-100 text-yellow-900 ring-2 ring-yellow-600 ring-offset-2"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => setSelectedCriticality('HIGH')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedCriticality === 'HIGH'
                        ? "bg-red-100 text-red-900 ring-2 ring-red-600 ring-offset-2"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    High
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedCriticality === 'HIGH' && 
                    "Critical service - downtime severely impacts end-users"}
                  {selectedCriticality === 'MEDIUM' && 
                    "Important service - downtime moderately affects end-users"}
                  {selectedCriticality === 'LOW' && 
                    "Non-critical service - minimal end-user impact if down"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                  <Label className="text-sm">Risk Tier</Label>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedRiskTier('CRITICAL')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedRiskTier === 'CRITICAL'
                        ? "bg-red-100 text-red-900 ring-2 ring-red-600 ring-offset-2"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    Critical
                  </button>
                  <button 
                    onClick={() => setSelectedRiskTier('SIGNIFICANT')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedRiskTier === 'SIGNIFICANT'
                        ? "bg-yellow-100 text-yellow-900 ring-2 ring-yellow-600 ring-offset-2"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    Significant
                  </button>
                  <button 
                    onClick={() => setSelectedRiskTier('GENERAL')}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      selectedRiskTier === 'GENERAL'
                        ? "bg-green-100 text-green-900 ring-2 ring-green-600 ring-offset-2"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    General
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedRiskTier === 'CRITICAL' && 
                    "Handles sensitive data, critical for platform operation"}
                  {selectedRiskTier === 'SIGNIFICANT' && 
                    "No user data access, but important for platform management"}
                  {selectedRiskTier === 'GENERAL' && 
                    "General vendor with minimal risk"}
                </p>
              </div>

              {data.node?.statusPageUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <Label className="text-sm">Status Page</Label>
                  </div>
                  <a 
                    href={data.node.statusPageUrl}
                    className="text-primary hover:underline inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Status Page
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function VendorOverviewPageFallback() {
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

export default function VendorOverviewPage() {
  const { vendorId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<VendorOverviewPageQueryType>(
    vendorOverviewPageQuery,
  );

  useEffect(() => {
    loadQuery({ vendorId: vendorId! });
  }, [loadQuery, vendorId]);

  if (!queryRef) {
    return <VendorOverviewPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Vendor Overview - Probo Console</title>
      </Helmet>
      <Suspense fallback={<VendorOverviewPageFallback />}>
        <VendorOverviewPageContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
