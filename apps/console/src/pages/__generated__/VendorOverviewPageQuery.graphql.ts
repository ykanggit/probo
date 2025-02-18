/**
 * @generated SignedSource<<939b83dd396154844197ee10514be613>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTier = "CRITICAL" | "GENERAL" | "SIGNIFICANT";
export type ServiceCriticality = "HIGH" | "LOW" | "MEDIUM";
export type VendorOverviewPageQuery$variables = {
  vendorId: string;
};
export type VendorOverviewPageQuery$data = {
  readonly node: {
    readonly createdAt?: any;
    readonly id?: string;
    readonly name?: string;
    readonly riskTier?: RiskTier;
    readonly serviceCriticality?: ServiceCriticality;
    readonly serviceStartDate?: any;
    readonly serviceTerminationDate?: any | null | undefined;
    readonly statusPageUrl?: string | null | undefined;
    readonly updatedAt?: any;
  };
};
export type VendorOverviewPageQuery = {
  response: VendorOverviewPageQuery$data;
  variables: VendorOverviewPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "vendorId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "vendorId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceStartDate",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceTerminationDate",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceCriticality",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "riskTier",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "statusPageUrl",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorOverviewPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/)
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorOverviewPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/)
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c9d7bade02d1802838f6ac3b02ef7c9a",
    "id": null,
    "metadata": {},
    "name": "VendorOverviewPageQuery",
    "operationKind": "query",
    "text": "query VendorOverviewPageQuery(\n  $vendorId: ID!\n) {\n  node(id: $vendorId) {\n    __typename\n    ... on Vendor {\n      id\n      name\n      serviceStartDate\n      serviceTerminationDate\n      serviceCriticality\n      riskTier\n      statusPageUrl\n      createdAt\n      updatedAt\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "92a640f674261d28028d752f027ec141";

export default node;
