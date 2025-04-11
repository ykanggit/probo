/**
 * @generated SignedSource<<0e66de0cfba2c27bbf78dcb8e846ad8d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTier = "CRITICAL" | "GENERAL" | "SIGNIFICANT";
export type ServiceCriticality = "HIGH" | "LOW" | "MEDIUM";
export type UpdateVendorInput = {
  category?: string | null | undefined;
  certifications?: ReadonlyArray<string> | null | undefined;
  dataProcessingAgreementUrl?: string | null | undefined;
  description?: string | null | undefined;
  headquarterAddress?: string | null | undefined;
  id: string;
  legalName?: string | null | undefined;
  name?: string | null | undefined;
  privacyPolicyUrl?: string | null | undefined;
  riskTier?: RiskTier | null | undefined;
  securityPageUrl?: string | null | undefined;
  serviceCriticality?: ServiceCriticality | null | undefined;
  serviceLevelAgreementUrl?: string | null | undefined;
  serviceStartAt?: string | null | undefined;
  serviceTerminationAt?: string | null | undefined;
  statusPageUrl?: string | null | undefined;
  termsOfServiceUrl?: string | null | undefined;
  trustPageUrl?: string | null | undefined;
  websiteUrl?: string | null | undefined;
};
export type VendorViewUpdateVendorMutation$variables = {
  input: UpdateVendorInput;
};
export type VendorViewUpdateVendorMutation$data = {
  readonly updateVendor: {
    readonly vendor: {
      readonly certifications: ReadonlyArray<string>;
      readonly dataProcessingAgreementUrl: string | null | undefined;
      readonly description: string | null | undefined;
      readonly headquarterAddress: string | null | undefined;
      readonly id: string;
      readonly legalName: string | null | undefined;
      readonly name: string;
      readonly privacyPolicyUrl: string | null | undefined;
      readonly riskTier: RiskTier;
      readonly securityPageUrl: string | null | undefined;
      readonly serviceCriticality: ServiceCriticality;
      readonly serviceLevelAgreementUrl: string | null | undefined;
      readonly serviceStartAt: string;
      readonly serviceTerminationAt: string | null | undefined;
      readonly statusPageUrl: string | null | undefined;
      readonly termsOfServiceUrl: string | null | undefined;
      readonly trustPageUrl: string | null | undefined;
      readonly updatedAt: string;
      readonly websiteUrl: string | null | undefined;
    };
  };
};
export type VendorViewUpdateVendorMutation = {
  response: VendorViewUpdateVendorMutation$data;
  variables: VendorViewUpdateVendorMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateVendorPayload",
    "kind": "LinkedField",
    "name": "updateVendor",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
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
            "name": "serviceStartAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "serviceTerminationAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "serviceCriticality",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "riskTier",
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
    "name": "VendorViewUpdateVendorMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorViewUpdateVendorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8ed69675626a00cac2cc79aa570f123d",
    "id": null,
    "metadata": {},
    "name": "VendorViewUpdateVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorViewUpdateVendorMutation(\n  $input: UpdateVendorInput!\n) {\n  updateVendor(input: $input) {\n    vendor {\n      id\n      name\n      description\n      serviceStartAt\n      serviceTerminationAt\n      serviceCriticality\n      riskTier\n      statusPageUrl\n      termsOfServiceUrl\n      privacyPolicyUrl\n      serviceLevelAgreementUrl\n      dataProcessingAgreementUrl\n      securityPageUrl\n      trustPageUrl\n      certifications\n      headquarterAddress\n      legalName\n      websiteUrl\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "517efd79b3eb1781ed562368a2ed1ecc";

export default node;
