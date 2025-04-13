/**
 * @generated SignedSource<<7a5c27ece406a4250a38977e9ed9173f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MesureImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type EditMesureViewQuery$variables = {
  mesureId: string;
};
export type EditMesureViewQuery$data = {
  readonly node: {
    readonly category?: string;
    readonly description?: string;
    readonly id?: string;
    readonly importance?: MesureImportance;
    readonly name?: string;
  };
};
export type EditMesureViewQuery = {
  response: EditMesureViewQuery$data;
  variables: EditMesureViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mesureId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "mesureId"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "importance",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditMesureViewQuery",
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
              (v6/*: any*/)
            ],
            "type": "Mesure",
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
    "name": "EditMesureViewQuery",
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
              (v6/*: any*/)
            ],
            "type": "Mesure",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d38df91a88f32d80da84fc47b7ca17ca",
    "id": null,
    "metadata": {},
    "name": "EditMesureViewQuery",
    "operationKind": "query",
    "text": "query EditMesureViewQuery(\n  $mesureId: ID!\n) {\n  node(id: $mesureId) {\n    __typename\n    ... on Mesure {\n      id\n      name\n      description\n      category\n      importance\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "abca56f710248363bacef919222a8420";

export default node;
