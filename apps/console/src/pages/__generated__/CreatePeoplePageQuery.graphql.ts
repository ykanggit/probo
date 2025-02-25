/**
 * @generated SignedSource<<25866c1f4e6fb640f91b8d05651df9f4>>
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
    readonly organization: {
      readonly id: string;
      readonly name: string;
    };
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
    "concreteType": "Viewer",
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
        "name": "organization",
        "plural": false,
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
    "cacheID": "e0b72d4317b700564caa46c609276aed",
    "id": null,
    "metadata": {},
    "name": "CreatePeoplePageQuery",
    "operationKind": "query",
    "text": "query CreatePeoplePageQuery {\n  viewer {\n    id\n    organization {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "89be7e6fd93829bdc8ac374983ca0a9b";

export default node;
