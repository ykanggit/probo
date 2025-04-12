"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, X, User } from "lucide-react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import type { VendorViewQuery as VendorViewQueryType } from "./__generated__/VendorViewQuery.graphql";
import type { VendorViewDeleteComplianceReportMutation as DeleteComplianceReportMutationType } from "./__generated__/VendorViewDeleteComplianceReportMutation.graphql";
import type { VendorViewUploadComplianceReportMutation as UploadComplianceReportMutationType } from "./__generated__/VendorViewUploadComplianceReportMutation.graphql";
import type { VendorViewUpdateVendorMutation } from "./__generated__/VendorViewUpdateVendorMutation.graphql";
import { useParams } from "react-router";
import { cn } from "@/lib/utils";
import { PageTemplate } from "@/components/PageTemplate";
import { VendorViewSkeleton } from "./VendorPage";
import PeopleSelector from "@/components/PeopleSelector";

const vendorViewQuery = graphql`
  query VendorViewQuery($vendorId: ID!, $organizationId: ID!) {
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
        serviceLevelAgreementUrl
        dataProcessingAgreementUrl
        securityPageUrl
        trustPageUrl
        certifications
        headquarterAddress
        legalName
        websiteUrl
        businessOwner {
          id
          fullName
        }
        securityOwner {
          id
          fullName
        }
        createdAt
        updatedAt
        complianceReports(first: 100)
          @connection(key: "VendorView_complianceReports") {
          edges {
            node {
              id
              reportName
              reportDate
              validUntil
              fileUrl
              fileSize
              createdAt
            }
          }
        }
      }
    }
    organization: node(id: $organizationId) {
      ...PeopleSelector_organization
    }
  }
`;

const updateVendorMutation = graphql`
  mutation VendorViewUpdateVendorMutation($input: UpdateVendorInput!) {
    updateVendor(input: $input) {
      vendor {
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
        serviceLevelAgreementUrl
        dataProcessingAgreementUrl
        securityPageUrl
        trustPageUrl
        certifications
        headquarterAddress
        legalName
        websiteUrl
        businessOwner {
          id
          fullName
        }
        securityOwner {
          id
          fullName
        }
        updatedAt
      }
    }
  }
`;

const deleteComplianceReportMutation = graphql`
  mutation VendorViewDeleteComplianceReportMutation(
    $input: DeleteVendorComplianceReportInput!
    $connections: [ID!]!
  ) {
    deleteVendorComplianceReport(input: $input) {
      deletedVendorComplianceReportId @deleteEdge(connections: $connections)
    }
  }
`;

const uploadComplianceReportMutation = graphql`
  mutation VendorViewUploadComplianceReportMutation(
    $input: UploadVendorComplianceReportInput!
    $connections: [ID!]!
  ) {
    uploadVendorComplianceReport(input: $input) {
      vendorComplianceReportEdge @appendEdge(connections: $connections) {
        node {
          id
          reportName
          reportDate
          validUntil
          fileUrl
          fileSize
          createdAt
        }
      }
    }
  }
`;

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-tertiary" />
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="space-y-2">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {helpText && <p className="text-sm text-secondary">{helpText}</p>}
      </div>
    </div>
  );
}

// Format date for input field (YYYY-MM-DDTHH:mm)
function formatDateForInput(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

// Format date for API (2006-01-02T15:04:05.999999999Z07:00)
function formatDateForAPI(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toISOString();
}

interface ComplianceReport {
  id: string;
  reportName: string;
  reportDate: string;
  validUntil: string | null | undefined;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
}

function ComplianceReportsTable({
  reports,
  onDelete,
  onUpload,
}: {
  reports: ComplianceReport[];
  onDelete: (id: string) => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Truncate filename to a reasonable length if needed
  const truncateFilename = (filename: string, maxLength = 40) => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split(".").pop();
    const name = filename.substring(0, maxLength - extension!.length - 3);
    return `${name}...${extension}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Compliance Reports</h2>
        <p className="text-sm text-secondary">
          Upload and manage compliance reports for this vendor
        </p>
      </div>
      <div className="rounded-md border">
        <div className="overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b">
                <th className="w-2/5 px-4 py-2 text-left text-sm font-medium">
                  Report Name
                </th>
                <th className="w-1/5 px-4 py-2 text-left text-sm font-medium">
                  Report Date
                </th>
                <th className="w-1/5 px-4 py-2 text-left text-sm font-medium">
                  Valid Until
                </th>
                <th className="w-1/5 px-4 py-2 text-left text-sm font-medium">
                  File Size
                </th>
                <th className="w-1/5 px-4 py-2 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="px-4 py-2">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline"
                      title={report.reportName}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateFilename(report.reportName)}
                      </div>
                    </a>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {report.validUntil
                      ? new Date(report.validUntil).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(report.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={onUpload}
          accept=".pdf"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary text-invert hover:bg-primary/90"
        >
          Upload New Report
        </Button>
        <p className="mt-2 text-sm text-secondary">
          Only PDF files up to 10MB are allowed
        </p>
      </div>
    </div>
  );
}

function TagList({
  tags,
  onAdd,
  onRemove,
}: {
  tags: readonly string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      onAdd(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
          >
            <span>{tag}</span>
            <button
              onClick={() => onRemove(tag)}
              className="text-primary hover:text-primary/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <Input
        type="text"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Type and press Enter to add a certification"
        className="mt-2"
      />
    </div>
  );
}

function VendorViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorViewQueryType>;
}) {
  const { organizationId } = useParams();
  const data = usePreloadedQuery(vendorViewQuery, queryRef);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: data.node.name || "",
    description: data.node.description || "",
    serviceStartAt: formatDateForInput(data.node.serviceStartAt),
    serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
    serviceCriticality: data.node.serviceCriticality,
    riskTier: data.node.riskTier,
    statusPageUrl: data.node.statusPageUrl || "",
    termsOfServiceUrl: data.node.termsOfServiceUrl || "",
    privacyPolicyUrl: data.node.privacyPolicyUrl || "",
    serviceLevelAgreementUrl: data.node.serviceLevelAgreementUrl || "",
    dataProcessingAgreementUrl: data.node.dataProcessingAgreementUrl || "",
    securityPageUrl: data.node.securityPageUrl || "",
    trustPageUrl: data.node.trustPageUrl || "",
    certifications: data.node.certifications || [],
    headquarterAddress: data.node.headquarterAddress || "",
    legalName: data.node.legalName || "",
    websiteUrl: data.node.websiteUrl || "",
    businessOwnerId: data.node.businessOwner?.id || null,
    securityOwnerId: data.node.securityOwner?.id || null,
  });
  const [updateVendor] =
    useMutation<VendorViewUpdateVendorMutation>(updateVendorMutation);
  const [deleteVendorComplianceReport] =
    useMutation<DeleteComplianceReportMutationType>(
      deleteComplianceReportMutation
    );
  const [uploadVendorComplianceReport] =
    useMutation<UploadComplianceReportMutationType>(
      uploadComplianceReportMutation
    );
  const [, loadQuery] = useQueryLoader<VendorViewQueryType>(vendorViewQuery);
  const { toast } = useToast();

  const hasChanges = editedFields.size > 0;

  const handleSave = useCallback(() => {
    const formattedData = {
      ...formData,
      serviceStartAt: formatDateForAPI(formData.serviceStartAt),
      serviceTerminationAt: formData.serviceTerminationAt
        ? formatDateForAPI(formData.serviceTerminationAt)
        : null,
      businessOwnerId: formData.businessOwnerId || undefined,
      securityOwnerId: formData.securityOwnerId || undefined,
    };

    updateVendor({
      variables: {
        input: {
          id: data.node.id!,
          ...formattedData,
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Changes saved successfully",
          variant: "default",
        });
        setEditedFields(new Set());
        loadQuery({ vendorId: data.node.id!, organizationId: organizationId! });
      },
      onError: (error) => {
        if (error.message?.includes("concurrent modification")) {
          toast({
            title: "Error",
            description:
              "Someone else modified this vendor. Reloading latest data.",
            variant: "destructive",
          });

          loadQuery({
            vendorId: data.node.id!,
            organizationId: organizationId!,
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to save changes",
            variant: "destructive",
          });
        }
      },
    });
  }, [updateVendor, data.node.id, formData, loadQuery, toast, organizationId]);

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setEditedFields((prev) => new Set(prev).add(field));
  };

  const handleCancel = () => {
    setFormData({
      name: data.node.name || "",
      description: data.node.description || "",
      serviceStartAt: formatDateForInput(data.node.serviceStartAt),
      serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
      serviceCriticality: data.node.serviceCriticality,
      riskTier: data.node.riskTier,
      statusPageUrl: data.node.statusPageUrl || "",
      termsOfServiceUrl: data.node.termsOfServiceUrl || "",
      privacyPolicyUrl: data.node.privacyPolicyUrl || "",
      serviceLevelAgreementUrl: data.node.serviceLevelAgreementUrl || "",
      dataProcessingAgreementUrl: data.node.dataProcessingAgreementUrl || "",
      securityPageUrl: data.node.securityPageUrl || "",
      trustPageUrl: data.node.trustPageUrl || "",
      certifications: data.node.certifications || [],
      headquarterAddress: data.node.headquarterAddress || "",
      legalName: data.node.legalName || "",
      websiteUrl: data.node.websiteUrl || "",
      businessOwnerId: data.node.businessOwner?.id || null,
      securityOwnerId: data.node.securityOwner?.id || null,
    });
    setEditedFields(new Set());
  };

  const handleDeleteReport = useCallback(
    (reportId: string) => {
      deleteVendorComplianceReport({
        variables: {
          connections: [
            ConnectionHandler.getConnectionID(
              data.node.id!,
              "VendorView_complianceReports"
            ),
          ],
          input: {
            reportId,
          },
        },
        onCompleted: () => {
          toast({
            title: "Success",
            description: "Compliance report deleted successfully",
            variant: "default",
          });
          loadQuery({
            vendorId: data.node.id!,
            organizationId: organizationId!,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete compliance report",
            variant: "destructive",
          });
        },
      });
    },
    [
      deleteVendorComplianceReport,
      data.node.id,
      loadQuery,
      toast,
      organizationId,
    ]
  );

  const handleUploadReport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Only PDF files are allowed",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const reportDate = new Date().toISOString();

        uploadVendorComplianceReport({
          variables: {
            connections: [
              ConnectionHandler.getConnectionID(
                data.node.id!,
                "VendorView_complianceReports"
              ),
            ],
            input: {
              vendorId: data.node.id!,
              reportDate,
              reportName: file.name,
              file: null,
            },
          },
          uploadables: {
            "input.file": file,
          },
          onCompleted: () => {
            toast({
              title: "Success",
              description: "Compliance report uploaded successfully",
              variant: "default",
            });
            loadQuery({
              vendorId: data.node.id!,
              organizationId: organizationId!,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description:
                error.message || "Failed to upload compliance report",
              variant: "destructive",
            });
          },
        });
      };
      reader.readAsDataURL(file);
    },
    [
      uploadVendorComplianceReport,
      data.node.id,
      loadQuery,
      toast,
      organizationId,
    ]
  );

  return (
    <PageTemplate title={formData.name}>
      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Basic Information</h2>
              <p className="text-sm text-secondary">
                General information about the vendor
              </p>
            </div>

            <div className="space-y-4">
              <EditableField
                label="Name"
                value={formData.name}
                onChange={(value) => handleFieldChange("name", value)}
              />

              <EditableField
                label="Description"
                value={formData.description}
                onChange={(value) => handleFieldChange("description", value)}
              />

              <EditableField
                label="Legal Name"
                value={formData.legalName}
                onChange={(value) => handleFieldChange("legalName", value)}
              />

              <EditableField
                label="Headquarter Address"
                value={formData.headquarterAddress}
                onChange={(value) =>
                  handleFieldChange("headquarterAddress", value)
                }
              />

              <EditableField
                label="Website URL"
                value={formData.websiteUrl}
                onChange={(value) => handleFieldChange("websiteUrl", value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Ownership Information</h2>
              <p className="text-sm text-secondary">
                Individuals responsible for this vendor
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-tertiary" />
                  <Label className="text-sm">Business Owner</Label>
                </div>
                <PeopleSelector
                  organizationRef={data.organization}
                  selectedPersonId={formData.businessOwnerId}
                  onSelect={(value) =>
                    handleFieldChange("businessOwnerId", value)
                  }
                  placeholder="Select business owner (optional)"
                />
                <p className="text-sm text-secondary">
                  The person responsible for business decisions related to this
                  vendor
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-tertiary" />
                  <Label className="text-sm">Security Owner</Label>
                </div>
                <PeopleSelector
                  organizationRef={data.organization}
                  selectedPersonId={formData.securityOwnerId}
                  onSelect={(value) =>
                    handleFieldChange("securityOwnerId", value)
                  }
                  placeholder="Select security owner (optional)"
                />
                <p className="text-sm text-secondary">
                  The person responsible for security oversight of this vendor
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">
                Risk & Service Information
              </h2>
              <p className="text-sm text-secondary">
                Information about service criticality and risk
              </p>
            </div>

            <div className="space-y-4">
              <EditableField
                label="Service Start At"
                value={formData.serviceStartAt}
                type="datetime-local"
                onChange={(value) => handleFieldChange("serviceStartAt", value)}
              />

              <EditableField
                label="Service Termination At"
                value={formData.serviceTerminationAt}
                type="datetime-local"
                onChange={(value) =>
                  handleFieldChange("serviceTerminationAt", value)
                }
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-tertiary" />
                  <Label className="text-sm">Service Criticality</Label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleFieldChange("serviceCriticality", "LOW")
                    }
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.serviceCriticality === "LOW"
                        ? "bg-success-bg text-success ring ring-success-b"
                        : "bg-invert-bg"
                    )}
                  >
                    Low
                  </button>
                  <button
                    onClick={() =>
                      handleFieldChange("serviceCriticality", "MEDIUM")
                    }
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.serviceCriticality === "MEDIUM"
                        ? "bg-warning-bg text-warning ring ring-warning-b"
                        : "bg-invert-bg"
                    )}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() =>
                      handleFieldChange("serviceCriticality", "HIGH")
                    }
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.serviceCriticality === "HIGH"
                        ? "bg-danger-bg text-danger ring ring-danger-b"
                        : "bg-invert-bg"
                    )}
                  >
                    High
                  </button>
                </div>
                <p className="text-sm text-secondary">
                  {formData.serviceCriticality === "HIGH" &&
                    "Critical service - downtime severely impacts end-users"}
                  {formData.serviceCriticality === "MEDIUM" &&
                    "Important service - downtime moderately affects end-users"}
                  {formData.serviceCriticality === "LOW" &&
                    "Non-critical service - minimal end-user impact if down"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-tertiary" />
                  <Label className="text-sm">Risk Tier</Label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFieldChange("riskTier", "CRITICAL")}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.riskTier === "CRITICAL"
                        ? "bg-danger-bg text-danger ring ring-danger-b"
                        : "bg-invert-bg"
                    )}
                  >
                    Critical
                  </button>
                  <button
                    onClick={() => handleFieldChange("riskTier", "SIGNIFICANT")}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.riskTier === "SIGNIFICANT"
                        ? "bg-warning-bg text-warning ring ring-warning-b"
                        : "bg-invert-bg"
                    )}
                  >
                    Significant
                  </button>
                  <button
                    onClick={() => handleFieldChange("riskTier", "GENERAL")}
                    className={cn(
                      "rounded-full px-4 py-1 text-sm transition-colors",
                      formData.riskTier === "GENERAL"
                        ? "bg-info-bg text-info ring ring-info-b"
                        : "bg-invert-bg"
                    )}
                  >
                    General
                  </button>
                </div>
                <p className="text-sm text-secondary">
                  {formData.riskTier === "CRITICAL" &&
                    "Handles sensitive data, critical for platform operation"}
                  {formData.riskTier === "SIGNIFICANT" &&
                    "No user data access, but important for platform management"}
                  {formData.riskTier === "GENERAL" &&
                    "General vendor with minimal risk"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Documentation & Links</h2>
              <p className="text-sm text-secondary">
                Important URLs related to the vendor
              </p>
            </div>

            <div className="space-y-4">
              <EditableField
                label="Status Page URL"
                value={formData.statusPageUrl}
                onChange={(value) => handleFieldChange("statusPageUrl", value)}
              />

              <EditableField
                label="Terms of Service URL"
                value={formData.termsOfServiceUrl}
                onChange={(value) =>
                  handleFieldChange("termsOfServiceUrl", value)
                }
              />

              <EditableField
                label="Privacy Policy URL"
                value={formData.privacyPolicyUrl}
                onChange={(value) =>
                  handleFieldChange("privacyPolicyUrl", value)
                }
              />

              <EditableField
                label="Service Level Agreement URL"
                value={formData.serviceLevelAgreementUrl}
                onChange={(value) =>
                  handleFieldChange("serviceLevelAgreementUrl", value)
                }
              />

              <EditableField
                label="Data Processing Agreement URL"
                value={formData.dataProcessingAgreementUrl}
                onChange={(value) =>
                  handleFieldChange("dataProcessingAgreementUrl", value)
                }
              />

              <EditableField
                label="Security Page URL"
                value={formData.securityPageUrl}
                onChange={(value) =>
                  handleFieldChange("securityPageUrl", value)
                }
              />

              <EditableField
                label="Trust Page URL"
                value={formData.trustPageUrl}
                onChange={(value) => handleFieldChange("trustPageUrl", value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Certifications</h2>
              <p className="text-sm text-secondary">
                List of certifications held by the vendor
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-tertiary" />
                  <Label className="text-sm">Certifications</Label>
                </div>
                <TagList
                  tags={[...formData.certifications]}
                  onAdd={(tag) =>
                    handleFieldChange("certifications", [
                      ...formData.certifications,
                      tag,
                    ])
                  }
                  onRemove={(tag) =>
                    handleFieldChange(
                      "certifications",
                      formData.certifications.filter((t) => t !== tag)
                    )
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <ComplianceReportsTable
            reports={
              data.node.complianceReports?.edges.map((edge) => edge.node) ?? []
            }
            onDelete={handleDeleteReport}
            onUpload={handleUploadReport}
          />
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
    </PageTemplate>
  );
}

export default function VendorView() {
  const { vendorId, organizationId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<VendorViewQueryType>(vendorViewQuery);

  useEffect(() => {
    loadQuery({ vendorId: vendorId!, organizationId: organizationId! });
  }, [loadQuery, vendorId, organizationId]);

  if (!queryRef) {
    return <VendorViewSkeleton />;
  }

  return (
    <Suspense fallback={<VendorViewSkeleton />}>
      <VendorViewContent queryRef={queryRef} />
    </Suspense>
  );
}
