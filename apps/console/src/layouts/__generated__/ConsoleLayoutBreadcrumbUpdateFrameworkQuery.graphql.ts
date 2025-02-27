/**
 * @generated SignedSource<<d4b3974723a445d3d352518d6244afd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbUpdateFrameworkQuery$variables = {
  frameworkId: string;
};
export type ConsoleLayoutBreadcrumbUpdateFrameworkQuery$data = {
  readonly framework: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbUpdateFrameworkQuery = {
  response: ConsoleLayoutBreadcrumbUpdateFrameworkQuery$data;
  variables: ConsoleLayoutBreadcrumbUpdateFrameworkQuery$variables;
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
    "name": "ConsoleLayoutBreadcrumbUpdateFrameworkQuery",
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
    "name": "ConsoleLayoutBreadcrumbUpdateFrameworkQuery",
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
    "cacheID": "194d6a240ee1e2f0ef799e08bc0e44f5",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbUpdateFrameworkQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbUpdateFrameworkQuery(\n  $frameworkId: ID!\n) {\n  framework: node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c6381fa068566e0ec00356b3e6835700";

export default node;
