"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, ArrowUpRight, Pencil, Check, X } from "lucide-react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import type { VendorOverviewPageQuery as VendorOverviewPageQueryType } from "./__generated__/VendorOverviewPageQuery.graphql";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { cn } from "@/lib/utils";
import type { UpdateVendorInput } from "./__generated__/VendorOverviewPageUpdateVendorMutation.graphql";

const vendorOverviewPageQuery = graphql`
  query VendorOverviewPageQuery($vendorId: ID!) {
    node(id: $vendorId) {
      ... on Vendor {
        id
        name
        description
        serviceStartAt
        serviceTerminationAt
        serviceCriticality
        riskTier
        statusPageUrl
        termsOfServiceUrl
        privacyPolicyUrl
        createdAt
        updatedAt
        version
      }
    }
  }
`;

const updateVendorMutation = graphql`
  mutation VendorOverviewPageUpdateVendorMutation($input: UpdateVendorInput!) {
    updateVendor(input: $input) {
        id
        name
        description
        serviceStartAt
        serviceTerminationAt
        serviceCriticality
        riskTier
        statusPageUrl
        termsOfServiceUrl
        privacyPolicyUrl
        updatedAt
        version
    }
  }
`;

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-gray-400" />
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="space-y-2">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    </div>
  );
}

// Format date for input field (YYYY-MM-DDTHH:mm)
function formatDateForInput(date: string | null | undefined): string {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 16);
}

// Format date for API (2006-01-02T15:04:05.999999999Z07:00)
function formatDateForAPI(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString();
}

function VendorOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(vendorOverviewPageQuery, queryRef);
  const { setBreadcrumbSegment } = useBreadcrumb();
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: data.node.name || '',
    description: data.node.description || '',
    // Format dates properly for datetime-local input
    serviceStartAt: formatDateForInput(data.node.serviceStartAt),
    serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
    serviceCriticality: data.node.serviceCriticality,
    riskTier: data.node.riskTier,
    statusPageUrl: data.node.statusPageUrl || '',
    termsOfServiceUrl: data.node.termsOfServiceUrl || '',
    privacyPolicyUrl: data.node.privacyPolicyUrl || '',
  });
  const [commit] = useMutation(updateVendorMutation);
  const [_, loadQuery] = useQueryLoader<VendorOverviewPageQueryType>(vendorOverviewPageQuery);
  const { toast } = useToast();

  const hasChanges = editedFields.size > 0;

  const handleSave = useCallback(() => {
    const formattedData = {
      ...formData,
      serviceStartAt: formatDateForAPI(formData.serviceStartAt),
      serviceTerminationAt: formData.serviceTerminationAt ? formatDateForAPI(formData.serviceTerminationAt) : null,
    };

    commit({
      variables: {
        input: {
          id: data.node.id,
          expectedVersion: data.node.version,
          ...formattedData,
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Changes saved successfully",
          variant: "default",
        });
      },
      onError: (error) => {
        if (error.message?.includes('concurrent modification')) {
          toast({
            title: "Error",
            description: "Someone else modified this vendor. Reloading latest data.",
            variant: "destructive",
          });

          loadQuery({ vendorId: data.node.id! });

        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to save changes",
            variant: "destructive",
          });
        }
      },
      updater: (store) => {
        // Clear any error states if needed
      },
    });
  }, [commit, data.node.id, data.node.version, formData, loadQuery, toast]);

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setEditedFields(prev => new Set(prev).add(field));
  };

  // Update the cancel handler to also format dates
  const handleCancel = () => {
    setFormData({
      name: data.node.name || '',
      description: data.node.description || '',
      serviceStartAt: formatDateForInput(data.node.serviceStartAt),
      serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
      serviceCriticality: data.node.serviceCriticality,
      riskTier: data.node.riskTier,
      statusPageUrl: data.node.statusPageUrl || '',
      termsOfServiceUrl: data.node.termsOfServiceUrl || '',
      privacyPolicyUrl: data.node.privacyPolicyUrl || '',
    });
    setEditedFields(new Set());
  };

  useEffect(() => {
    if (data.node?.name) {
      setBreadcrumbSegment("vendors/:id", data.node.name);
    }
  }, [data.node?.name, setBreadcrumbSegment]);

  return (
    <>
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <EditableField
            label="Name"
            value={formData.name}
            onChange={(value) => handleFieldChange('name', value)}
          />

          <EditableField
            label="Description"
            value={formData.description}
            onChange={(value) => handleFieldChange('description', value)}
          />

          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Service Information</h2>
                <p className="text-sm text-gray-500">
                  Basic information about the vendor service
                </p>
              </div>

              <div className="space-y-4">
                <EditableField
                  label="Service Start At"
                  value={formData.serviceStartAt}
                  type="datetime-local"
                  onChange={(value) => handleFieldChange('serviceStartAt', value)}
                />

                <EditableField
                  label="Service Termination At"
                  value={formData.serviceTerminationAt}
                  type="datetime-local"
                  onChange={(value) => handleFieldChange('serviceTerminationAt', value)}
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <Label className="text-sm">Service Criticality</Label>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleFieldChange('serviceCriticality', 'LOW')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.serviceCriticality === 'LOW'
                          ? "bg-green-100 text-green-900 ring-2 ring-green-600 ring-offset-2" 
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      Low
                    </button>
                    <button 
                      onClick={() => handleFieldChange('serviceCriticality', 'MEDIUM')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.serviceCriticality === 'MEDIUM'
                          ? "bg-yellow-100 text-yellow-900 ring-2 ring-yellow-600 ring-offset-2"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => handleFieldChange('serviceCriticality', 'HIGH')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.serviceCriticality === 'HIGH'
                          ? "bg-red-100 text-red-900 ring-2 ring-red-600 ring-offset-2"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      High
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.serviceCriticality === 'HIGH' && 
                      "Critical service - downtime severely impacts end-users"}
                    {formData.serviceCriticality === 'MEDIUM' && 
                      "Important service - downtime moderately affects end-users"}
                    {formData.serviceCriticality === 'LOW' && 
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
                      onClick={() => handleFieldChange('riskTier', 'CRITICAL')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.riskTier === 'CRITICAL'
                          ? "bg-red-100 text-red-900 ring-2 ring-red-600 ring-offset-2"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      Critical
                    </button>
                    <button 
                      onClick={() => handleFieldChange('riskTier', 'SIGNIFICANT')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.riskTier === 'SIGNIFICANT'
                          ? "bg-yellow-100 text-yellow-900 ring-2 ring-yellow-600 ring-offset-2"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      Significant
                    </button>
                    <button 
                      onClick={() => handleFieldChange('riskTier', 'GENERAL')}
                      className={cn(
                        "rounded-full px-4 py-1 text-sm transition-colors",
                        formData.riskTier === 'GENERAL'
                          ? "bg-green-100 text-green-900 ring-2 ring-green-600 ring-offset-2"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      )}
                    >
                      General
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.riskTier === 'CRITICAL' && 
                      "Handles sensitive data, critical for platform operation"}
                    {formData.riskTier === 'SIGNIFICANT' && 
                      "No user data access, but important for platform management"}
                    {formData.riskTier === 'GENERAL' && 
                      "General vendor with minimal risk"}
                  </p>
                </div>

                <EditableField
                  label="Status Page URL"
                  value={formData.statusPageUrl || ""}
                  onChange={(value) => handleFieldChange('statusPageUrl', value)}
                />

                <EditableField
                  label="Terms of Service URL"
                  value={formData.termsOfServiceUrl || ""}
                  onChange={(value) => handleFieldChange('termsOfServiceUrl', value)}
                />

                <EditableField
                  label="Privacy Policy URL"
                  value={formData.privacyPolicyUrl || ""}
                  onChange={(value) => handleFieldChange('privacyPolicyUrl', value)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      )}
    </>
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
