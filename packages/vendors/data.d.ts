/**
 * Type definitions for vendor data
 */

/**
 * Category types for vendors
 */
export type VendorCategory =
  | 'Analytics'
  | 'Cloud monitoring'
  | 'Cloud provider'
  | 'Collaboration'
  | 'Customer support'
  | 'Data storage and processing'
  | 'Document management'
  | 'Employee management'
  | 'Engineering'
  | 'Finance'
  | 'Identity provider'
  | 'IT'
  | 'Marketing'
  | 'Office operations'
  | 'Other'
  | 'Password management'
  | 'Product and design'
  | 'Professional services'
  | 'Recruiting'
  | 'Sales'
  | 'Security'
  | 'Version control';

/**
 * Represents a software vendor or service provider with associated metadata
 */
export interface Vendor {
  /** Display name of the vendor */
  name: string;
  
  /** Legal business name of the vendor */
  legalName?: string;
  
  /** Physical headquarters address */
  headquarterAddress?: string;
  
  /** Vendor's website URL */
  websiteUrl: string;
  
  /** URL to vendor's privacy policy */
  privacyPolicyUrl?: string;
  
  /** URL to vendor's terms of service */
  termsOfServiceUrl?: string;
  
  /** URL to vendor's service level agreement */
  serviceLevelAgreementUrl?: string;
  
  /** URL to service software agreement */
  serviceSoftwareAgreementUrl?: string;
  
  /** URL to vendor's data processing agreement */
  dataProcessingAgreementUrl?: string;
  
  /** URL to vendor's list of subprocessors */
  subprocessorsListUrl?: string;
  
  /** URL to vendor's business associate agreement */
  businessAssociateAgreementUrl?: string;
  
  /** Short description of the vendor/service */
  description?: string;
  
  /** Primary category for the vendor */
  category?: VendorCategory;
  
  /** Security or compliance certifications held by the vendor */
  certifications?: string[];
  
  /** URL to vendor's security page */
  securityPageUrl?: string;
  
  /** URL to vendor's trust page */
  trustPageUrl?: string;
  
  /** URL to vendor's status page */
  statusPageUrl?: string;
}

/**
 * Array of vendor data
 */
export type Vendors = Vendor[];


/**
 * Default export representing the entire vendor dataset
 */
declare const data: Vendors;

export default data;
