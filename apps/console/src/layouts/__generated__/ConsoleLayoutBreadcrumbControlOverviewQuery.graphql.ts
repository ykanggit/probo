/**
 * @generated SignedSource<<00ec8864c54512b021bdfa0f7b53cd43>>
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
  readonly control: {
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
        "alias": "control",
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
        "alias": "control",
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
    "cacheID": "7ff42b211b319b1a413258ef2242b6e3",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbControlOverviewQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "089c9c977bce592f440e3503f62aee3a";

export default node;
