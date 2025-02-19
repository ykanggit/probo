/**
 * @generated SignedSource<<03e542b8e2ecf3c17be86da4526541d2>>
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
  description: string;
  name: string;
  organizationId: string;
  privacyPolicyUrl?: string | null | undefined;
  riskTier: RiskTier;
  serviceCriticality: ServiceCriticality;
  serviceStartAt: any;
  serviceTerminationAt?: any | null | undefined;
  statusPageUrl?: string | null | undefined;
  termsOfServiceUrl?: string | null | undefined;
};
export type VendorListPageCreateVendorMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateVendorInput;
};
export type VendorListPageCreateVendorMutation$data = {
  readonly createVendor: {
    readonly vendorEdge: {
      readonly node: {
        readonly createdAt: any;
        readonly id: string;
        readonly name: string;
        readonly updatedAt: any;
      };
    };
  };
};
export type VendorListPageCreateVendorMutation = {
  response: VendorListPageCreateVendorMutation$data;
  variables: VendorListPageCreateVendorMutation$variables;
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
          "name": "createdAt",
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorListPageCreateVendorMutation",
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
    "name": "VendorListPageCreateVendorMutation",
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
    "cacheID": "ddfddd8b4266631b16341e6fe2e04cb5",
    "id": null,
    "metadata": {},
    "name": "VendorListPageCreateVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListPageCreateVendorMutation(\n  $input: CreateVendorInput!\n) {\n  createVendor(input: $input) {\n    vendorEdge {\n      node {\n        id\n        name\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "03c48ba8f1db919da507322208e5e136";

export default node;
