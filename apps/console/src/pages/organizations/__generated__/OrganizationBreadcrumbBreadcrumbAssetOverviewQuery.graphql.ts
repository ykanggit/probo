/**
 * @generated SignedSource<<7ee0fb485c12093374bdcbdf43d0a2df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbAssetOverviewQuery$variables = {
  assetId: string;
};
export type OrganizationBreadcrumbBreadcrumbAssetOverviewQuery$data = {
  readonly asset: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbAssetOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbAssetOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbAssetOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "assetId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "assetId"
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
  "type": "Asset",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbAssetOverviewQuery",
    "selections": [
      {
        "alias": "asset",
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
    "name": "OrganizationBreadcrumbBreadcrumbAssetOverviewQuery",
    "selections": [
      {
        "alias": "asset",
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
    "cacheID": "41b1d32aad685d08edfdbf989207e758",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbAssetOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbAssetOverviewQuery(\n  $assetId: ID!\n) {\n  asset: node(id: $assetId) {\n    __typename\n    id\n    ... on Asset {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4c3d736cb93af42b7dcb88cdcb293e8f";

export default node;
