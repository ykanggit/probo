/**
 * @generated SignedSource<<6f086aeafe55fd91abdf75b5832f76e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbPeopleOverviewQuery$variables = {
  peopleId: string;
};
export type ConsoleLayoutBreadcrumbPeopleOverviewQuery$data = {
  readonly people: {
    readonly fullName?: string;
    readonly id: string;
  };
};
export type ConsoleLayoutBreadcrumbPeopleOverviewQuery = {
  response: ConsoleLayoutBreadcrumbPeopleOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbPeopleOverviewQuery$variables;
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
    "name": "ConsoleLayoutBreadcrumbPeopleOverviewQuery",
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
    "name": "ConsoleLayoutBreadcrumbPeopleOverviewQuery",
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
    "cacheID": "ae4480910071c40c530fabf42d140afd",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbPeopleOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbPeopleOverviewQuery(\n  $peopleId: ID!\n) {\n  people: node(id: $peopleId) {\n    __typename\n    id\n    ... on People {\n      fullName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ffd8d5be8b9b8a930c956c8d292715d8";

export default node;
