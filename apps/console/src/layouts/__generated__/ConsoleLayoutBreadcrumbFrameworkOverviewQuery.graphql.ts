/**
 * @generated SignedSource<<b762e82a823e00ae26cd82eff55352b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbFrameworkOverviewQuery$variables = {
  peopleId: string;
};
export type ConsoleLayoutBreadcrumbFrameworkOverviewQuery$data = {
  readonly people: {
    readonly fullName?: string;
    readonly id: string;
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
    "name": "peopleId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "peopleId"
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
      "name": "fullName",
      "storageKey": null
    }
  ],
  "type": "People",
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
        "alias": "people",
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
        "alias": "people",
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
    "cacheID": "38bda48229b0d45b23dff36b33fa3adb",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbFrameworkOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbFrameworkOverviewQuery(\n  $peopleId: ID!\n) {\n  people: node(id: $peopleId) {\n    __typename\n    id\n    ... on People {\n      fullName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1f4b25d943e1d8a79c3e77936833e998";

export default node;
