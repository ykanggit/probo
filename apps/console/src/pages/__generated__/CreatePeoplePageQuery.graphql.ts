/**
 * @generated SignedSource<<9453bfb4e947c003e812ae63a4f1ed0a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreatePeoplePageQuery$variables = Record<PropertyKey, never>;
export type CreatePeoplePageQuery$data = {
  readonly viewer: {
    readonly id: string;
    readonly organizations: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
  };
};
export type CreatePeoplePageQuery = {
  response: CreatePeoplePageQuery$data;
  variables: CreatePeoplePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organizations",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreatePeoplePageQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreatePeoplePageQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "74b036184be646c06a001772776c445b",
    "id": null,
    "metadata": {},
    "name": "CreatePeoplePageQuery",
    "operationKind": "query",
    "text": "query CreatePeoplePageQuery {\n  viewer {\n    id\n    organizations {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "751fa313df4e5ed06f8100d1e7e2d4ea";

export default node;
