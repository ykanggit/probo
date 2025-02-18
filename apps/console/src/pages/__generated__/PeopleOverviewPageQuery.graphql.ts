/**
 * @generated SignedSource<<528ad6b0a104964c9d947ef1e9c41b46>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PeopleKind = "CONTRACTOR" | "EMPLOYEE";
export type PeopleOverviewPageQuery$variables = {
  peopleId: string;
};
export type PeopleOverviewPageQuery$data = {
  readonly node: {
    readonly additionalEmailAddresses?: ReadonlyArray<string>;
    readonly createdAt?: any;
    readonly fullName?: string;
    readonly id?: string;
    readonly kind?: PeopleKind;
    readonly primaryEmailAddress?: string;
    readonly updatedAt?: any;
    readonly version?: number;
  };
};
export type PeopleOverviewPageQuery = {
  response: PeopleOverviewPageQuery$data;
  variables: PeopleOverviewPageQuery$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "primaryEmailAddress",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "additionalEmailAddresses",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kind",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleOverviewPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "type": "People",
            "abstractKey": null
          }
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
    "name": "PeopleOverviewPageQuery",
    "selections": [
      {
        "alias": null,
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "type": "People",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1383ca6e8c8b205082cc68223bec1833",
    "id": null,
    "metadata": {},
    "name": "PeopleOverviewPageQuery",
    "operationKind": "query",
    "text": "query PeopleOverviewPageQuery(\n  $peopleId: ID!\n) {\n  node(id: $peopleId) {\n    __typename\n    ... on People {\n      id\n      fullName\n      primaryEmailAddress\n      additionalEmailAddresses\n      kind\n      createdAt\n      updatedAt\n      version\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "fa229186ad9e51f3a60b23fa88a882aa";

export default node;
