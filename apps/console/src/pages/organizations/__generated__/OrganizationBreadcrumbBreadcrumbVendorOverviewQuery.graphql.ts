/**
 * @generated SignedSource<<8c8b57ca97101932acdb5d73038e228c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbVendorOverviewQuery$variables = {
  vendorId: string;
};
export type OrganizationBreadcrumbBreadcrumbVendorOverviewQuery$data = {
  readonly vendor: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbVendorOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbVendorOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbVendorOverviewQuery$variables;
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
    "name": "OrganizationBreadcrumbBreadcrumbVendorOverviewQuery",
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
    "name": "OrganizationBreadcrumbBreadcrumbVendorOverviewQuery",
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
    "cacheID": "e3b7ec1aa637099854e157f0f06f5289",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbVendorOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbVendorOverviewQuery(\n  $vendorId: ID!\n) {\n  vendor: node(id: $vendorId) {\n    __typename\n    id\n    ... on Vendor {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "eb448c353f367e8b4de619facc855959";

export default node;
