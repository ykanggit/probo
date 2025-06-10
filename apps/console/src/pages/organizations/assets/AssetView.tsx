"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { Suspense, useEffect, useState, useCallback } from "react";
import type { AssetViewQuery as AssetViewQueryType } from "./__generated__/AssetViewQuery.graphql";
import { useParams } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { AssetViewSkeleton } from "./AssetPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PeopleSelector from "@/components/PeopleSelector";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const assetViewQuery = graphql`
  query AssetViewQuery($assetId: ID!, $organizationId: ID!) {
    node(id: $assetId) {
      ... on Asset {
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
    organization: node(id: $organizationId) {
      ...PeopleSelector_organization
      ... on Organization {
        vendors(first: 100, orderBy: { direction: ASC, field: NAME }) @connection(key: "AssetView_vendors") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const updateAssetMutation = graphql`
  mutation AssetViewUpdateAssetMutation($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      asset {
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
        updatedAt
      }
    }
  }
`;

type AssetType = "PHYSICAL" | "VIRTUAL";
type CriticityLevel = "LOW" | "MEDIUM" | "HIGH";

interface Vendor {
  readonly id: string;
  readonly name: string;
}

interface Organization {
  readonly id?: string;
  readonly vendors?: {
    readonly edges: ReadonlyArray<{
      readonly node: Vendor;
    } | null> | null;
  } | null;
}

interface Asset {
  readonly id?: string;
  readonly name?: string;
  readonly amount?: number;
  readonly criticity?: CriticityLevel;
  readonly assetType?: AssetType;
  readonly dataTypesStored?: string;
  readonly owner?: {
    readonly id: string;
    readonly fullName: string;
  } | null;
  readonly vendors?: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly name: string;
      };
    } | null> | null;
  } | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: string;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="space-y-2">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? parseInt(e.target.value, 10) || 0 : e.target.value)}
        />
        {helpText && <p className="text-sm text-secondary">{helpText}</p>}
      </div>
    </div>
  );
}

function AssetViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<AssetViewQueryType>;
}) {
  const data = usePreloadedQuery(assetViewQuery, queryRef);
  const { organizationId } = useParams();
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const asset = data.node as Asset | null;
  const [formData, setFormData] = useState({
    name: asset?.name || "",
    amount: asset?.amount || 0,
    criticity: asset?.criticity || "LOW",
    assetType: asset?.assetType || "VIRTUAL",
    dataTypesStored: asset?.dataTypesStored || "",
    ownerId: asset?.owner?.id || "",
    selectedVendorIds: (asset?.vendors?.edges || [])
      .map(edge => edge?.node?.id)
      .filter((id): id is string => id != null) || [],
  });
  const [commit] = useMutation(updateAssetMutation);
  const [, loadQuery] = useQueryLoader<AssetViewQueryType>(assetViewQuery);
  const { toast } = useToast();
  const hasChanges = editedFields.size > 0;

  const handleSave = useCallback(() => {
    const nodeId = data.node?.id;
    if (!nodeId) return;

    commit({
      variables: {
        input: {
          id: nodeId,
          name: formData.name,
          amount: formData.amount,
          criticity: formData.criticity,
          assetType: formData.assetType,
          dataTypesStored: formData.dataTypesStored,
          ownerId: formData.ownerId,
          vendorIds: formData.selectedVendorIds,
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Changes saved successfully",
          variant: "default",
        });
        setEditedFields(new Set());
      },
      onError: (error) => {
        const defaultErrorValues = {
          title: "Error",
          description: error.message || "Failed to save changes",
          variant: "destructive" as const
        };

        if (error.message?.includes("concurrent modification")) {
          toast({
            ...defaultErrorValues,
            description: "Someone else modified this asset. Reloading latest data.",
          });
          loadQuery({ assetId: nodeId, organizationId: organizationId! });
        } else {
          toast(defaultErrorValues);
        }
      },
    });
  }, [commit, data.node?.id, formData, loadQuery, toast, organizationId]);

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setEditedFields((prev) => new Set(prev).add(field));
  };

  const handleVendorSelect = (vendorId: string) => {
    handleFieldChange(
      "selectedVendorIds",
      formData.selectedVendorIds.includes(vendorId)
        ? formData.selectedVendorIds.filter((id) => id !== vendorId)
        : [...formData.selectedVendorIds, vendorId]
    );
  };

  const handleCancel = () => {
    const asset = data.node as Asset | null;
    setFormData({
      name: asset?.name || "",
      amount: asset?.amount || 0,
      criticity: asset?.criticity || "LOW",
      assetType: asset?.assetType || "VIRTUAL",
      dataTypesStored: asset?.dataTypesStored || "",
      ownerId: asset?.owner?.id || "",
      selectedVendorIds: (asset?.vendors?.edges || [])
        .map((edge) => edge?.node?.id)
        .filter((id): id is string => id != null) || [],
    });
    setEditedFields(new Set());
  };

  const organization = data.organization as Organization;
  const vendors = (organization.vendors?.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is Vendor => node != null);

  return (
    <PageTemplate title={formData.name || "Asset Details"}>
      <div className="space-y-6">
        <div className="max-w-4xl space-y-6">
          <EditableField
            label="Name"
            value={formData.name}
            onChange={(value) => handleFieldChange("name", value)}
            helpText="Enter the name of the asset"
          />

          <EditableField
            label="Amount"
            value={formData.amount}
            type="number"
            onChange={(value) => handleFieldChange("amount", value)}
            helpText="Enter the amount of the asset"
          />

          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Asset Details</h2>
                <p className="text-sm text-secondary">
                  Additional details about the asset
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Owner</Label>
                  </div>
                  <PeopleSelector
                    organizationRef={data.organization}
                    selectedPersonId={formData.ownerId}
                    onSelect={(value) => handleFieldChange("ownerId", value)}
                    placeholder="Select asset owner"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Vendors</Label>
                  <Select
                    value=""
                    onValueChange={handleVendorSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendors" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.selectedVendorIds.map((vendorId) => {
                      const vendor = vendors.find((v) => v.id === vendorId);
                      if (!vendor) return null;
                      return (
                        <Badge key={vendorId} variant="secondary" className="flex items-center gap-1">
                          {vendor.name}
                          <button
                            type="button"
                            onClick={() => handleVendorSelect(vendorId)}
                            className="hover:bg-secondary-hover rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Criticity Level</Label>
                  </div>
                  <Select
                    value={formData.criticity}
                    onValueChange={(value) => handleFieldChange("criticity", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select criticity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Asset Type</Label>
                  </div>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => handleFieldChange("assetType", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHYSICAL">Physical</SelectItem>
                      <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Data Types Stored</Label>
                  </div>
                  <Textarea
                    value={formData.dataTypesStored}
                    onChange={(e) => handleFieldChange("dataTypesStored", e.target.value)}
                    placeholder="Enter the types of data stored in this asset..."
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-invert hover:bg-primary/90"
              disabled={!hasChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

export default function AssetView() {
  const { assetId, organizationId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<AssetViewQueryType>(assetViewQuery);

  useEffect(() => {
    loadQuery({ assetId: assetId!, organizationId: organizationId! });
  }, [loadQuery, assetId, organizationId]);

  if (!queryRef) {
    return <AssetViewSkeleton />;
  }

  return (
    <Suspense fallback={<AssetViewSkeleton />}>
      <AssetViewContent queryRef={queryRef} />
    </Suspense>
  );
}
