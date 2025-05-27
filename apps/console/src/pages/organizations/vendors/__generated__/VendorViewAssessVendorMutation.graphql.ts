/**
 * @generated SignedSource<<f0c7d1514ae65ab5cef017af474f5825>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type VendorCategory = "ANALYTICS" | "CLOUD_MONITORING" | "CLOUD_PROVIDER" | "COLLABORATION" | "CUSTOMER_SUPPORT" | "DATA_STORAGE_AND_PROCESSING" | "DOCUMENT_MANAGEMENT" | "EMPLOYEE_MANAGEMENT" | "ENGINEERING" | "FINANCE" | "IDENTITY_PROVIDER" | "IT" | "MARKETING" | "OFFICE_OPERATIONS" | "OTHER" | "PASSWORD_MANAGEMENT" | "PRODUCT_AND_DESIGN" | "PROFESSIONAL_SERVICES" | "RECRUITING" | "SALES" | "SECURITY" | "VERSION_CONTROL";
export type AssessVendorInput = {
  id: string;
  websiteUrl: string;
};
export type VendorViewAssessVendorMutation$variables = {
  input: AssessVendorInput;
};
export type VendorViewAssessVendorMutation$data = {
  readonly assessVendor: {
    readonly vendor: {
      readonly businessOwner: {
        readonly fullName: string;
        readonly id: string;
      } | null | undefined;
      readonly category: VendorCategory;
      readonly certifications: ReadonlyArray<string>;
      readonly dataProcessingAgreementUrl: string | null | undefined;
      readonly description: string | null | undefined;
      readonly headquarterAddress: string | null | undefined;
      readonly id: string;
      readonly legalName: string | null | undefined;
      readonly name: string;
      readonly privacyPolicyUrl: string | null | undefined;
      readonly securityOwner: {
        readonly fullName: string;
        readonly id: string;
      } | null | undefined;
      readonly securityPageUrl: string | null | undefined;
      readonly serviceLevelAgreementUrl: string | null | undefined;
      readonly statusPageUrl: string | null | undefined;
      readonly termsOfServiceUrl: string | null | undefined;
      readonly trustPageUrl: string | null | undefined;
      readonly updatedAt: string;
      readonly websiteUrl: string | null | undefined;
    };
  };
};
export type VendorViewAssessVendorMutation = {
  response: VendorViewAssessVendorMutation$data;
  variables: VendorViewAssessVendorMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fullName",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AssessVendorPayload",
    "kind": "LinkedField",
    "name": "assessVendor",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Vendor",
        "kind": "LinkedField",
        "name": "vendor",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "statusPageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "termsOfServiceUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "privacyPolicyUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "serviceLevelAgreementUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "dataProcessingAgreementUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "securityPageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "trustPageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "certifications",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "headquarterAddress",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "legalName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "websiteUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "businessOwner",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "securityOwner",
            "plural": false,
            "selections": (v2/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "updatedAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorViewAssessVendorMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorViewAssessVendorMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "592ee741d52ee98a1e10330e97a14707",
    "id": null,
    "metadata": {},
    "name": "VendorViewAssessVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorViewAssessVendorMutation(\n  $input: AssessVendorInput!\n) {\n  assessVendor(input: $input) {\n    vendor {\n      id\n      name\n      description\n      statusPageUrl\n      termsOfServiceUrl\n      privacyPolicyUrl\n      serviceLevelAgreementUrl\n      dataProcessingAgreementUrl\n      securityPageUrl\n      trustPageUrl\n      certifications\n      headquarterAddress\n      legalName\n      websiteUrl\n      category\n      businessOwner {\n        id\n        fullName\n      }\n      securityOwner {\n        id\n        fullName\n      }\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8dddda77f031533f207ac903d883a902";

export default node;
