/**
 * @generated SignedSource<<733d7a1785075f67a2b120aec123d3d3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationLayoutBreadcrumbFrameworkOverviewQuery$variables = {
  frameworkId: string;
};
export type OrganizationLayoutBreadcrumbFrameworkOverviewQuery$data = {
  readonly framework: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationLayoutBreadcrumbFrameworkOverviewQuery = {
  response: OrganizationLayoutBreadcrumbFrameworkOverviewQuery$data;
  variables: OrganizationLayoutBreadcrumbFrameworkOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "frameworkId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "frameworkId"
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
  "type": "Framework",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationLayoutBreadcrumbFrameworkOverviewQuery",
    "selections": [
      {
        "alias": "framework",
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
    "name": "OrganizationLayoutBreadcrumbFrameworkOverviewQuery",
    "selections": [
      {
        "alias": "framework",
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
    "cacheID": "75003c9ef679845e901b7ecd8c591da7",
    "id": null,
    "metadata": {},
    "name": "OrganizationLayoutBreadcrumbFrameworkOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationLayoutBreadcrumbFrameworkOverviewQuery(\n  $frameworkId: ID!\n) {\n  framework: node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c8da93cc3207000e73285e126d12a882";

export default node;
