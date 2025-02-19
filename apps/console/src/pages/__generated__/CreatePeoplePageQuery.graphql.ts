/**
 * @generated SignedSource<<90c9055cb59db9172002bc02e6e9429d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreatePeoplePageQuery$variables = Record<PropertyKey, never>;
export type CreatePeoplePageQuery$data = {
  readonly currentOrganization: {
    readonly id: string;
    readonly name?: string;
  };
};
export type CreatePeoplePageQuery = {
  response: CreatePeoplePageQuery$data;
  variables: CreatePeoplePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "AZSfP_xAcAC5IAAAAAAltA"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
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
  "type": "Organization",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreatePeoplePageQuery",
    "selections": [
      {
        "alias": "currentOrganization",
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreatePeoplePageQuery",
    "selections": [
      {
        "alias": "currentOrganization",
        "args": (v0/*: any*/),
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
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ]
  },
  "params": {
    "cacheID": "816d745d1a69d598b3507fa4df1e878f",
    "id": null,
    "metadata": {},
    "name": "CreatePeoplePageQuery",
    "operationKind": "query",
    "text": "query CreatePeoplePageQuery {\n  currentOrganization: node(id: \"AZSfP_xAcAC5IAAAAAAltA\") {\n    __typename\n    id\n    ... on Organization {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "54148a2bd398d4fda7c72b60c7210e6d";

export default node;
