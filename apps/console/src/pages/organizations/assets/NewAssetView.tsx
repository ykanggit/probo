import { useState, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { graphql, useMutation, ConnectionHandler, useQueryLoader, PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageTemplate } from "@/components/PageTemplate";
import { NewAssetViewCreateAssetMutation } from "./__generated__/NewAssetViewCreateAssetMutation.graphql";
import { NewAssetViewQuery } from "./__generated__/NewAssetViewQuery.graphql";
import PeopleSelector from "@/components/PeopleSelector";
import { NewAssetViewSkeleton } from "./NewAssetPage";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const newAssetViewQuery = graphql`
  query NewAssetViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        id
        ...PeopleSelector_organization
        vendors(first: 100, orderBy: { direction: ASC, field: NAME }) @connection(key: "NewAssetView_vendors") {
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

const createAssetMutation = graphql`
  mutation NewAssetViewCreateAssetMutation(
    $input: CreateAssetInput!
    $connections: [ID!]!
  ) {
    createAsset(input: $input) {
      assetEdge @prependEdge(connections: $connections) {
        node {
          id
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
        }
      }
    }
  }
`;

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

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
  required,
  min,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
  required?: boolean;
  min?: number;
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
          onChange={(e) => onChange(e.target.value)}
          required={required}
          min={min}
        />
        {helpText && <p className="text-sm text-secondary">{helpText}</p>}
      </div>
    </div>
  );
}

function NewAssetViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<NewAssetViewQuery>;
}) {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const [createAsset] = useMutation<NewAssetViewCreateAssetMutation>(createAssetMutation);
  const { toast } = useToast();
  const data = usePreloadedQuery(newAssetViewQuery, queryRef);

  if (!data.organization) {
    return <div>Organization not found</div>;
  }

  const organization = data.organization as Organization;

  const [formData, setFormData] = useState({
    name: "",
    amount: 1,
    criticity: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    assetType: "VIRTUAL" as "PHYSICAL" | "VIRTUAL",
    dataTypesStored: "",
    ownerId: "",
    selectedVendorIds: [] as string[],
  });

  type FormData = typeof formData;

  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVendorSelect = (vendorId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedVendorIds: prev.selectedVendorIds.includes(vendorId)
        ? prev.selectedVendorIds.filter((id) => id !== vendorId)
        : [...prev.selectedVendorIds, vendorId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ownerId) {
      toast({
        title: "Error",
        description: "Please select an owner",
        variant: "destructive",
      });
      return;
    }

    createAsset({
      variables: {
        connections: [
          ConnectionHandler.getConnectionID(
            organizationId!,
            "AssetsListView_assets",
            {
              orderBy: {
                direction: "ASC",
                field: "AMOUNT",
              },
            },
          ),
        ],
        input: {
          organizationId: organizationId!,
          name: formData.name,
          amount: Number(formData.amount),
          criticity: formData.criticity,
          assetType: formData.assetType,
          dataTypesStored: formData.dataTypesStored,
          ownerId: formData.ownerId,
          vendorIds: formData.selectedVendorIds.length > 0 ? formData.selectedVendorIds : undefined,
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Asset created successfully",
          variant: "default",
        });
        navigate(`/organizations/${organizationId}/assets`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create asset",
          variant: "destructive",
        });
      },
    });
  };

  const vendors = (organization.vendors?.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is Vendor => node != null);

  return (
    <PageTemplate
      title="Create Asset"
      description="Add a new asset to your organization"
    >
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl space-y-6">
          <EditableField
            label="Name"
            value={formData.name}
            onChange={(value) => handleFieldChange("name", value)}
            required
          />
          <EditableField
            label="Amount"
            value={formData.amount}
            onChange={(value) => handleFieldChange("amount", Number(value))}
            type="number"
            min={1}
            required
          />

          <div className="space-y-2">
            <Label className="text-sm">Owner</Label>
            <PeopleSelector
              organizationRef={data.organization}
              selectedPersonId={formData.ownerId}
              onSelect={(value) => handleFieldChange("ownerId", value)}
              placeholder="Select asset owner"
              required
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
            <Label className="text-sm">Criticity Level</Label>
            <Select
              value={formData.criticity}
              onValueChange={(value: string) =>
                handleFieldChange("criticity", value as "LOW" | "MEDIUM" | "HIGH")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select criticity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Asset Type</Label>
            <Select
              value={formData.assetType}
              onValueChange={(value: string) =>
                handleFieldChange("assetType", value as "PHYSICAL" | "VIRTUAL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHYSICAL">Physical</SelectItem>
                <SelectItem value="VIRTUAL">Virtual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Data Types Stored</Label>
            <Textarea
              value={formData.dataTypesStored}
              onChange={(e) => handleFieldChange("dataTypesStored", e.target.value)}
              placeholder="Enter the types of data stored in this asset..."
            />
          </div>

          <Button type="submit">Create Asset</Button>
        </div>
      </form>
    </PageTemplate>
  );
}

export default function NewAssetView() {
  const { organizationId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<NewAssetViewQuery>(newAssetViewQuery);

  useEffect(() => {
    loadQuery({ organizationId: organizationId! });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <NewAssetViewSkeleton />;
  }

  return (
    <Suspense fallback={<NewAssetViewSkeleton />}>
      <NewAssetViewContent queryRef={queryRef} />
    </Suspense>
  );
}
