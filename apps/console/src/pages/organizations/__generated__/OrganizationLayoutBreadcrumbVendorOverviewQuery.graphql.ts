/**
 * @generated SignedSource<<d0ab5ff850203d4209b0d189e8c28b7c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationLayoutBreadcrumbVendorOverviewQuery$variables = {
  vendorId: string;
};
export type OrganizationLayoutBreadcrumbVendorOverviewQuery$data = {
  readonly vendor: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationLayoutBreadcrumbVendorOverviewQuery = {
  response: OrganizationLayoutBreadcrumbVendorOverviewQuery$data;
  variables: OrganizationLayoutBreadcrumbVendorOverviewQuery$variables;
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
    "name": "OrganizationLayoutBreadcrumbVendorOverviewQuery",
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
    "name": "OrganizationLayoutBreadcrumbVendorOverviewQuery",
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
    "cacheID": "cdf321fbd087d345096d8af142d99608",
    "id": null,
    "metadata": {},
    "name": "OrganizationLayoutBreadcrumbVendorOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationLayoutBreadcrumbVendorOverviewQuery(\n  $vendorId: ID!\n) {\n  vendor: node(id: $vendorId) {\n    __typename\n    id\n    ... on Vendor {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "41b87834c3e5625381d8434930cf29db";

export default node;
