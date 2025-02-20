/**
 * @generated SignedSource<<1706f11580339ff248a8fa9b53862829>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbFrameworkOverviewQuery$variables = {
  frameworkId: string;
};
export type ConsoleLayoutBreadcrumbFrameworkOverviewQuery$data = {
  readonly framework: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbFrameworkOverviewQuery = {
  response: ConsoleLayoutBreadcrumbFrameworkOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbFrameworkOverviewQuery$variables;
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
    "name": "ConsoleLayoutBreadcrumbFrameworkOverviewQuery",
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
    "name": "ConsoleLayoutBreadcrumbFrameworkOverviewQuery",
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
    "cacheID": "287decd67859fe4c2248b6d6b0a3d56d",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbFrameworkOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbFrameworkOverviewQuery(\n  $frameworkId: ID!\n) {\n  framework: node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a4c4f857eb13cf154a01f70874f0fd58";

export default node;
