/**
 * @generated SignedSource<<266ca8730d2832be4d4c96d325c3e4ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbVendorOverviewQuery$variables = {
  vendorId: string;
};
export type ConsoleLayoutBreadcrumbVendorOverviewQuery$data = {
  readonly vendor: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbVendorOverviewQuery = {
  response: ConsoleLayoutBreadcrumbVendorOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbVendorOverviewQuery$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Vendor",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConsoleLayoutBreadcrumbVendorOverviewQuery",
    "selections": [
      {
        "alias": "vendor",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "ConsoleLayoutBreadcrumbVendorOverviewQuery",
    "selections": [
      {
        "alias": "vendor",
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
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d0b39b21eec610e1162705b7e2799468",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbVendorOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbVendorOverviewQuery(\n  $vendorId: ID!\n) {\n  vendor: node(id: $vendorId) {\n    __typename\n    id\n    ... on Vendor {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "20bb1420f2d13cf7974591da5e6b654f";

export default node;
