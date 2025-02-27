/**
 * @generated SignedSource<<72acdb0b83faf29c9d1a4f403a40ac5e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbCreateControlQuery$variables = {
  frameworkId: string;
};
export type ConsoleLayoutBreadcrumbCreateControlQuery$data = {
  readonly framework: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbCreateControlQuery = {
  response: ConsoleLayoutBreadcrumbCreateControlQuery$data;
  variables: ConsoleLayoutBreadcrumbCreateControlQuery$variables;
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
    "name": "ConsoleLayoutBreadcrumbCreateControlQuery",
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
    "name": "ConsoleLayoutBreadcrumbCreateControlQuery",
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
    "cacheID": "96453f593f21e812afc5b888cc68da3e",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbCreateControlQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbCreateControlQuery(\n  $frameworkId: ID!\n) {\n  framework: node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f249019075c60c4449f6f232229a6965";

export default node;
