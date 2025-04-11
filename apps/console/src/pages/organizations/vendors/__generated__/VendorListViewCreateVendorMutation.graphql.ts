/**
 * @generated SignedSource<<d8ebd7f4de7a9e2e314f93e5e6b61e25>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTier = "CRITICAL" | "GENERAL" | "SIGNIFICANT";
export type ServiceCriticality = "HIGH" | "LOW" | "MEDIUM";
export type CreateVendorInput = {
  category?: string | null | undefined;
  certifications?: ReadonlyArray<string> | null | undefined;
  dataProcessingAgreementUrl?: string | null | undefined;
  description?: string | null | undefined;
  headquarterAddress?: string | null | undefined;
  legalName?: string | null | undefined;
  name: string;
  organizationId: string;
  privacyPolicyUrl?: string | null | undefined;
  riskTier: RiskTier;
  securityPageUrl?: string | null | undefined;
  serviceCriticality: ServiceCriticality;
  serviceLevelAgreementUrl?: string | null | undefined;
  serviceStartAt: string;
  serviceTerminationAt?: string | null | undefined;
  statusPageUrl?: string | null | undefined;
  termsOfServiceUrl?: string | null | undefined;
  trustPageUrl?: string | null | undefined;
  websiteUrl?: string | null | undefined;
};
export type VendorListViewCreateVendorMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateVendorInput;
};
export type VendorListViewCreateVendorMutation$data = {
  readonly createVendor: {
    readonly vendorEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string | null | undefined;
        readonly id: string;
        readonly name: string;
        readonly riskTier: RiskTier;
        readonly updatedAt: string;
      };
    };
  };
};
export type VendorListViewCreateVendorMutation = {
  response: VendorListViewCreateVendorMutation$data;
  variables: VendorListViewCreateVendorMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "VendorEdge",
  "kind": "LinkedField",
  "name": "vendorEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Vendor",
      "kind": "LinkedField",
      "name": "node",
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
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "riskTier",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorListViewCreateVendorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateVendorPayload",
        "kind": "LinkedField",
        "name": "createVendor",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "VendorListViewCreateVendorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateVendorPayload",
        "kind": "LinkedField",
        "name": "createVendor",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "vendorEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cedd0394889a1b00d329ed9f30dcb3b9",
    "id": null,
    "metadata": {},
    "name": "VendorListViewCreateVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListViewCreateVendorMutation(\n  $input: CreateVendorInput!\n) {\n  createVendor(input: $input) {\n    vendorEdge {\n      node {\n        id\n        name\n        description\n        createdAt\n        updatedAt\n        riskTier\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9be60a8a66ae0214cf280252be1c6b7b";

export default node;
