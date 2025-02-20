/**
 * @generated SignedSource<<2369d48ac2f92f14d77f24d397fe7c18>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbControlOverviewQuery$variables = {
  controlId: string;
};
export type ConsoleLayoutBreadcrumbControlOverviewQuery$data = {
  readonly vendor: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbControlOverviewQuery = {
  response: ConsoleLayoutBreadcrumbControlOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbControlOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "controlId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "controlId"
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
  "type": "Control",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
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
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
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
    "cacheID": "00384256b541f268704b25cbb9c2cb0a",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbControlOverviewQuery(\n  $controlId: ID!\n) {\n  vendor: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cfa3ce6c9e7a6c25f7b147ba61a00b55";

export default node;
