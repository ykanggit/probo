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
import type { VendorViewCreateRiskAssessmentMutation } from "./__generated__/VendorViewCreateRiskAssessmentMutation.graphql";
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
        riskAssessments(first: 100)
          @connection(key: "VendorView_riskAssessments") {
          edges {
            node {
              id
          assessedAt
          expiresAt
          dataSensitivity
          businessImpact
          notes
          assessedBy {
            id
            fullName
          }
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

const createRiskAssessmentMutation = graphql`
  mutation VendorViewCreateRiskAssessmentMutation(
    $input: CreateVendorRiskAssessmentInput!
    $connections: [ID!]!
  ) {
    createVendorRiskAssessment(input: $input) {
      vendorRiskAssessmentEdge @appendEdge(connections: $connections) {
        node {
          id
          assessedAt
          expiresAt
          dataSensitivity
          businessImpact
          notes
          assessedBy {
            id
            fullName
          }
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
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // Format date to match Figma design
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#ECEFEC] bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(2,42,2,0.08)]">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Report name</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Report date</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Valid until</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right w-16"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-[rgba(2,42,2,0.08)]">
                <td className="px-4 py-3">
                  <div className="flex flex-col justify-center">
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-normal text-[#141E12] hover:underline"
                    >
                      {report.reportName}
                    </a>
                    <span className="text-xs text-[#818780]">
                      {formatFileSize(report.fileSize)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-normal text-[#141E12]">
                    {formatDate(report.reportDate)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-normal text-[#141E12]">
                    {report.validUntil ? formatDate(report.validUntil) : 'N/A'}
                  </span>
                </td>
                <td className="text-right pr-6 py-3">
                  <div className="relative" ref={showDropdown === report.id ? dropdownRef : null}>
                    <button
                      className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-[rgba(2,42,2,0.03)]"
                      onClick={() => setShowDropdown(showDropdown === report.id ? null : report.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" fill="#141E12"/>
                        <path d="M3 9.5C3.82843 9.5 4.5 8.82843 4.5 8C4.5 7.17157 3.82843 6.5 3 6.5C2.17157 6.5 1.5 7.17157 1.5 8C1.5 8.82843 2.17157 9.5 3 9.5Z" fill="#141E12"/>
                        <path d="M13 9.5C13.8284 9.5 14.5 8.82843 14.5 8C14.5 7.17157 13.8284 6.5 13 6.5C12.1716 6.5 11.5 7.17157 11.5 8C11.5 8.82843 12.1716 9.5 13 9.5Z" fill="#141E12"/>
                      </svg>
                    </button>
                    {showDropdown === report.id && (
                      <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-[#ECEFEC] z-10" style={{ bottom: '100%', marginBottom: '5px' }}>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => {
                            onDelete(report.id);
                            setShowDropdown(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-sm text-[#818780]">
                  No compliance reports uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
          className="rounded-full px-4 py-2 bg-[#054D05] text-white hover:bg-[#054D05]/90"
          size="sm"
        >
          Upload New Report
        </Button>
        <p className="mt-2 text-sm text-[#6B716A]">
          Only PDF files up to 10MB are allowed
        </p>
      </div>
    </div>
  );
}

function CertificationsView({
  certifications,
  onAdd,
  onRemove,
}: {
  certifications: readonly string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  // Common security standards
  const securityStandards = ["SOC 2", "ISO 27001", "HITRUST", "NIST"];
  
  // Regulatory and legal certifications
  const regulatoryLegal = ["HIPAA", "FERPA", "FISMA", "PIPEDA", "GDPR", "CCPA"];
  
  // Industry-specific certifications
  const industrySpecific = ["FinTech", "MPAA", "GSMA"];
  
  // International & government certifications
  const internationalGov = ["FedRAMP", "ENS High", "IRAP", "CJIS"];
  
  // State for new certification input
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCertification, setNewCertification] = useState("");

  // Handle adding a new custom certification
  const handleAddCertification = () => {
    if (newCertification.trim()) {
      onAdd(newCertification.trim());
      setNewCertification("");
      setShowAddModal(false);
    }
  };

  // Get certifications by category
  const securityCerts = certifications.filter(cert => securityStandards.includes(cert));
  const regulatoryCerts = certifications.filter(cert => regulatoryLegal.includes(cert));
  const industryCerts = certifications.filter(cert => industrySpecific.includes(cert));
  const internationalCerts = certifications.filter(cert => internationalGov.includes(cert));
  const customCerts = certifications.filter(cert => 
    ![...securityStandards, ...regulatoryLegal, ...industrySpecific, ...internationalGov].includes(cert)
  );

  return (
    <div className="rounded-xl border border-[#ECEFEC] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(2,42,2,0.08)]">
        <h3 className="text-base font-medium text-[#141E12]">Certifications</h3>
        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-full bg-[rgba(0,39,0,0.05)] text-[#141E12] hover:bg-[rgba(0,39,0,0.08)] h-8 px-3"
          size="sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
            <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add certification
        </Button>
      </div>
      
      <div className="p-5 space-y-6">
        {/* Security Standards */}
        {securityCerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#141E12]">Security Standards</h4>
            <div className="flex flex-wrap gap-2">
              {securityCerts.map(cert => (
                <div
                  key={cert}
                  className="flex items-center gap-1 rounded bg-[rgba(5,77,5,0.03)] px-2 py-1.5 text-sm font-medium text-[#6B716A]"
                >
                  <span>{cert}</span>
                  <button
                    onClick={() => onRemove(cert)}
                    className="text-[#6B716A] hover:text-[#141E12]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Regulatory & Legal */}
        {regulatoryCerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#141E12]">Regulatory & Legal</h4>
            <div className="flex flex-wrap gap-2">
              {regulatoryCerts.map(cert => (
                <div
                  key={cert}
                  className="flex items-center gap-1 rounded bg-[rgba(5,77,5,0.03)] px-2 py-1.5 text-sm font-medium text-[#6B716A]"
                >
                  <span>{cert}</span>
                  <button
                    onClick={() => onRemove(cert)}
                    className="text-[#6B716A] hover:text-[#141E12]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Industry-Specific */}
        {industryCerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#141E12]">Industry-Specific</h4>
            <div className="flex flex-wrap gap-2">
              {industryCerts.map(cert => (
                <div
                  key={cert}
                  className="flex items-center gap-1 rounded bg-[rgba(5,77,5,0.03)] px-2 py-1.5 text-sm font-medium text-[#6B716A]"
                >
                  <span>{cert}</span>
                  <button
                    onClick={() => onRemove(cert)}
                    className="text-[#6B716A] hover:text-[#141E12]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* International & Government */}
        {internationalCerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#141E12]">International & Government</h4>
            <div className="flex flex-wrap gap-2">
              {internationalCerts.map(cert => (
                <div
                  key={cert}
                  className="flex items-center gap-1 rounded bg-[rgba(5,77,5,0.03)] px-2 py-1.5 text-sm font-medium text-[#6B716A]"
                >
                  <span>{cert}</span>
                  <button
                    onClick={() => onRemove(cert)}
                    className="text-[#6B716A] hover:text-[#141E12]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Custom certifications */}
        {customCerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#141E12]">Custom Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {customCerts.map(cert => (
                <div
                  key={cert}
                  className="flex items-center gap-1 rounded bg-[rgba(5,77,5,0.03)] px-2 py-1.5 text-sm font-medium text-[#6B716A]"
                >
                  <span>{cert}</span>
                  <button
                    onClick={() => onRemove(cert)}
                    className="text-[#6B716A] hover:text-[#141E12]"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Certification Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Custom Certification</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="certification-name">Certification Name</Label>
                <Input 
                  id="certification-name"
                  value={newCertification} 
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Enter certification name"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCertification}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RiskAssessment {
  id: string;
  assessedAt: string;
  expiresAt: string;
  dataSensitivity: string;
  businessImpact: string;
  notes: string | null;
  assessedBy: {
    id: string;
    fullName: string;
  } | null;
  createdAt: string;
}

function RiskAssessmentsTable({
  assessments,
  onCreateAssessment,
}: {
  assessments: RiskAssessment[];
  onCreateAssessment: () => void;
}) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date to match Figma design
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get severity label based on data sensitivity and business impact
  const getSeverityLabel = (dataSensitivity: string, businessImpact: string) => {
    // Simple logic to determine severity - can be adjusted based on requirements
    if (dataSensitivity === 'CRITICAL' || businessImpact === 'CRITICAL') {
      return { label: 'Critical', color: 'bg-red-100 text-red-800' };
    } else if (dataSensitivity === 'HIGH' || businessImpact === 'HIGH') {
      return { label: 'High', color: 'bg-orange-100 text-orange-800' };
    } else if (dataSensitivity === 'MEDIUM' || businessImpact === 'MEDIUM') {
      return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'Low', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#ECEFEC] bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(2,42,2,0.08)]">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Assessed Date</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Expires</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Data Sensitivity</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Business Impact</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Severity</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#818780]">Assessed By</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right w-16"></th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => {
              const severity = getSeverityLabel(assessment.dataSensitivity, assessment.businessImpact);
              return (
                <tr key={assessment.id} className="border-b border-[rgba(2,42,2,0.08)]">
                  <td className="px-4 py-3">
                    <span className="text-sm font-normal text-[#141E12]">
                      {formatDate(assessment.assessedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-normal text-[#141E12]">
                      {formatDate(assessment.expiresAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-normal text-[#141E12]">
                      {assessment.dataSensitivity.charAt(0) + assessment.dataSensitivity.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-normal text-[#141E12]">
                      {assessment.businessImpact.charAt(0) + assessment.businessImpact.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-normal px-2 py-1 rounded-full ${severity.color}`}>
                      {severity.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-normal text-[#141E12]">
                      {assessment.assessedBy?.fullName || 'N/A'}
                    </span>
                  </td>
                  <td className="text-right pr-6 py-3">
                    <div className="relative" ref={showDropdown === assessment.id ? dropdownRef : null}>
                      <button
                        className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-[rgba(2,42,2,0.03)]"
                        onClick={() => setShowDropdown(showDropdown === assessment.id ? null : assessment.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" fill="#141E12"/>
                          <path d="M3 9.5C3.82843 9.5 4.5 8.82843 4.5 8C4.5 7.17157 3.82843 6.5 3 6.5C2.17157 6.5 1.5 7.17157 1.5 8C1.5 8.82843 2.17157 9.5 3 9.5Z" fill="#141E12"/>
                          <path d="M13 9.5C13.8284 9.5 14.5 8.82843 14.5 8C14.5 7.17157 13.8284 6.5 13 6.5C12.1716 6.5 11.5 7.17157 11.5 8C11.5 8.82843 12.1716 9.5 13 9.5Z" fill="#141E12"/>
                        </svg>
                      </button>
                      {showDropdown === assessment.id && (
                        <div className="absolute right-0 mt-1 bg-white rounded-md shadow-lg border border-[#ECEFEC] z-10" style={{ bottom: '100%', marginBottom: '5px' }}>
                          <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-[rgba(2,42,2,0.03)]"
                            onClick={() => {
                              // View or edit functionality can be added here
                              setShowDropdown(null);
                            }}
                          >
                            View details
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-sm text-[#818780]">
                  No risk assessments created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Button
          onClick={onCreateAssessment}
          className="rounded-full px-4 py-2 bg-[#054D05] text-white hover:bg-[#054D05]/90"
          size="sm"
        >
          Create Risk Assessment
        </Button>
        <p className="mt-2 text-sm text-[#6B716A]">
          Create a new risk assessment for this vendor
        </p>
      </div>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'certifications' | 'complianceReports' | 'riskAssessments'>('overview');
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: data.node.name || "",
    description: data.node.description || "",
    serviceStartAt: formatDateForInput(data.node.serviceStartAt),
    serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
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
    riskTier: "GENERAL" as "GENERAL" | "SIGNIFICANT" | "CRITICAL",
    serviceCriticality: "LOW" as "LOW" | "MEDIUM" | "HIGH",
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
  const [createRiskAssessment] =
    useMutation<VendorViewCreateRiskAssessmentMutation>(
      createRiskAssessmentMutation
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

  // Auto-save handler specifically for certifications
  const handleCertificationChange = useCallback((newCertifications: string[]) => {
    // Update local state
    setFormData(prev => ({
      ...prev,
      certifications: newCertifications,
    }));
    
    // Auto-save the changes immediately
    const formattedData = {
      id: data.node.id!,
      certifications: newCertifications,
    };

    updateVendor({
      variables: {
        input: formattedData,
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Certifications updated",
          variant: "default",
        });
        loadQuery({ vendorId: data.node.id!, organizationId: organizationId! });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update certifications",
          variant: "destructive",
        });
      },
    });
  }, [updateVendor, data.node.id, loadQuery, toast, organizationId]);

  const handleCancel = () => {
    setFormData({
      name: data.node.name || "",
      description: data.node.description || "",
      serviceStartAt: formatDateForInput(data.node.serviceStartAt),
      serviceTerminationAt: formatDateForInput(data.node.serviceTerminationAt),
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
      riskTier: "GENERAL" as "GENERAL" | "SIGNIFICANT" | "CRITICAL",
      serviceCriticality: "LOW" as "LOW" | "MEDIUM" | "HIGH",
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

  const handleCreateRiskAssessment = useCallback(() => {
    // Current date for assessedAt, and 1 year later for expiresAt
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    createRiskAssessment({
      variables: {
        connections: [
          ConnectionHandler.getConnectionID(
            data.node.id!,
            "VendorView_riskAssessments"
          ),
        ],
        input: {
          vendorId: data.node.id!,
          assessedBy: data.node.businessOwner?.id || "",
          expiresAt: nextYear.toISOString(),
          dataSensitivity: "LOW",
          businessImpact: "LOW",
          notes: "Initial risk assessment",
          attachments: []
        },
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Risk assessment created successfully",
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
          description: error.message || "Failed to create risk assessment",
          variant: "destructive",
        });
      },
    });
  }, [createRiskAssessment, data.node.id, data.node.businessOwner?.id, loadQuery, toast, organizationId]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVendorId = () => {
    const id = data.node.id;
    if (!id) return "";
    return `vendor_${id.split(':')[1] || id}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-x-12 gap-y-4 items-start mb-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-secondary">Vendor ID</p>
                <p className="text-sm text-tertiary">{getVendorId()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-secondary">Joined</p>
                <p className="text-sm text-tertiary">{formatDate(data.node.createdAt)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Vendor details card */}
              <div className="rounded-xl border border-border bg-white p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(2,42,2,0.08)]">
                  <h3 className="text-base font-medium">Vendor details</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Name</p>
                    <div className="rounded-lg bg-[rgba(5,77,5,0.03)] px-2 py-1.5">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full font-geist font-medium text-[16px] leading-[1.5em] text-[#141E12] bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 p-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Description</p>
                    <div className="rounded-lg bg-[rgba(5,77,5,0.03)] px-2 py-1.5">
                      <textarea
                        value={formData.description}
                        onChange={(e) => {
                          handleFieldChange("description", e.target.value);
                          e.target.style.height = '0';
                          e.target.style.height = (e.target.scrollHeight) + 'px';
                        }}
                        className="w-full font-geist font-medium text-[16px] leading-[1.5em] text-[#141E12] bg-transparent border-0 resize-none outline-none focus:ring-0 focus-visible:ring-0 p-0"
                        style={{ 
                          overflow: 'hidden',
                          height: 'auto',
                          minHeight: '1.5em',
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Legal name</p>
                    <div className="rounded-lg bg-[rgba(5,77,5,0.03)] px-2 py-1.5">
                      <input
                        type="text"
                        value={formData.legalName}
                        onChange={(e) => handleFieldChange("legalName", e.target.value)}
                        className="w-full font-geist font-medium text-[16px] leading-[1.5em] text-[#141E12] bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 p-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Headquarter Address</p>
                    <div className="rounded-lg bg-[rgba(5,77,5,0.03)] px-2 py-1.5">
                      <input
                        type="text"
                        value={formData.headquarterAddress}
                        onChange={(e) => handleFieldChange("headquarterAddress", e.target.value)}
                        className="w-full font-geist font-medium text-[16px] leading-[1.5em] text-[#141E12] bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 p-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Website URL</p>
                    <div className="rounded-lg bg-[rgba(5,77,5,0.03)] px-2 py-1.5">
                      <input
                        type="text"
                        value={formData.websiteUrl}
                        onChange={(e) => handleFieldChange("websiteUrl", e.target.value)}
                        className="w-full font-geist font-medium text-[16px] leading-[1.5em] text-[#141E12] bg-transparent border-0 outline-none focus:ring-0 focus-visible:ring-0 p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ownership details card */}
              <div className="rounded-xl border border-border bg-white p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(2,42,2,0.08)]">
                  <h3 className="text-base font-medium">Ownership details</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#6B716A]">Business Owner</p>
                      <HelpCircle className="h-4 w-4 text-tertiary" />
                    </div>
                    <div className="bg-[rgba(5,77,5,0.03)] rounded-lg p-1">
                      <PeopleSelector
                        organizationRef={data.organization}
                        selectedPersonId={formData.businessOwnerId}
                        onSelect={(value) => handleFieldChange("businessOwnerId", value)}
                        placeholder="Select"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#6B716A]">Security Owner</p>
                      <HelpCircle className="h-4 w-4 text-tertiary" />
                    </div>
                    <div className="bg-[rgba(5,77,5,0.03)] rounded-lg p-1">
                      <PeopleSelector
                        organizationRef={data.organization}
                        selectedPersonId={formData.securityOwnerId}
                        onSelect={(value) => handleFieldChange("securityOwnerId", value)}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk & Service Information card */}
              <div className="rounded-xl border border-border bg-white p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(2,42,2,0.08)]">
                  <h3 className="text-base font-medium">Risk & Service Information</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">Start date</p>
                    <div className="inline-block bg-[rgba(5,77,5,0.03)] rounded-lg px-3 py-2">
                      <Input
                        type="datetime-local"
                        value={formData.serviceStartAt}
                        onChange={(e) => handleFieldChange("serviceStartAt", e.target.value)}
                        className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 w-auto"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B716A]">End date</p>
                    <div className="inline-block bg-[rgba(5,77,5,0.03)] rounded-lg px-3 py-2">
                      <Input
                        type="datetime-local"
                        value={formData.serviceTerminationAt}
                        onChange={(e) => handleFieldChange("serviceTerminationAt", e.target.value)}
                        className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 w-auto"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Links card */}
              <div className="rounded-xl border border-border bg-white p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(2,42,2,0.08)]">
                  <h3 className="text-base font-medium">Links</h3>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Status Page URL</p>
                    <Input
                      value={formData.statusPageUrl}
                      onChange={(e) => handleFieldChange("statusPageUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Terms of Service URL</p>
                    <Input
                      value={formData.termsOfServiceUrl}
                      onChange={(e) => handleFieldChange("termsOfServiceUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Privacy Policy URL</p>
                    <Input
                      value={formData.privacyPolicyUrl}
                      onChange={(e) => handleFieldChange("privacyPolicyUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Service Level Agreement URL</p>
                    <Input
                      value={formData.serviceLevelAgreementUrl}
                      onChange={(e) => handleFieldChange("serviceLevelAgreementUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Data Processing Agreement URL</p>
                    <Input
                      value={formData.dataProcessingAgreementUrl}
                      onChange={(e) => handleFieldChange("dataProcessingAgreementUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Security Page URL</p>
                    <Input
                      value={formData.securityPageUrl}
                      onChange={(e) => handleFieldChange("securityPageUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] py-4 px-5">
                    <p className="text-sm font-medium text-[#6B716A]">Trust Page URL</p>
                    <Input
                      value={formData.trustPageUrl}
                      onChange={(e) => handleFieldChange("trustPageUrl", e.target.value)}
                      className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'certifications':
        return (
          <CertificationsView
            certifications={[...formData.certifications]}
            onAdd={(cert) => 
              handleCertificationChange([
                ...formData.certifications.filter(c => c !== cert),
                cert,
              ])
            }
            onRemove={(cert) =>
              handleCertificationChange(
                formData.certifications.filter((c) => c !== cert)
              )
            }
          />
        );
      case 'complianceReports':
        return (
          <div className="space-y-4">
            <ComplianceReportsTable
              reports={
                data.node.complianceReports?.edges.map((edge) => edge.node) ?? []
              }
              onDelete={handleDeleteReport}
              onUpload={handleUploadReport}
            />
          </div>
        );
      case 'riskAssessments':
        return (
          <div className="space-y-4">
            <RiskAssessmentsTable
              assessments={
                (data.node.riskAssessments?.edges.map(edge => edge.node) || []) as RiskAssessment[]
              }
              onCreateAssessment={handleCreateRiskAssessment}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageTemplate title={formData.name}>
        <div className="border-b mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 -mb-px", 
                activeTab === 'overview' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary hover:text-primary hover:border-secondary"
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 -mb-px", 
                activeTab === 'certifications' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary hover:text-primary hover:border-secondary"
              )}
            >
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('complianceReports')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 -mb-px", 
                activeTab === 'complianceReports' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary hover:text-primary hover:border-secondary"
              )}
            >
              Compliance reports
            </button>
            <button
              onClick={() => setActiveTab('riskAssessments')}
              className={cn("px-4 py-3 text-sm font-medium border-b-2 -mb-px", 
                activeTab === 'riskAssessments' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-secondary hover:text-primary hover:border-secondary"
              )}
            >
              Risk assessments
            </button>
          </div>
        </div>

        {/* Tab content */}
        {renderTabContent()}

        {/* Save/cancel buttons */}
        {hasChanges && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-invert hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        )}
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
