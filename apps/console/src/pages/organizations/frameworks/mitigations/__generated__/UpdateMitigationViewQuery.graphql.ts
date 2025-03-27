/**
 * @generated SignedSource<<c4f9f399e7a3d6c0e0482af3eccc8492>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type UpdateMitigationViewQuery$variables = {
  mitigationId: string;
};
export type UpdateMitigationViewQuery$data = {
  readonly node: {
    readonly category?: string;
    readonly description?: string;
    readonly id?: string;
    readonly importance?: MitigationImportance;
    readonly name?: string;
    readonly state?: MitigationState;
  };
};
export type UpdateMitigationViewQuery = {
  response: UpdateMitigationViewQuery$data;
  variables: UpdateMitigationViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mitigationId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "mitigationId"
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
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateMitigationViewQuery",
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
              (v7/*: any*/)
            ],
            "type": "Mitigation",
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
    "name": "UpdateMitigationViewQuery",
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
              (v7/*: any*/)
            ],
            "type": "Mitigation",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "81b47701802e110078ee303a83c19d88",
    "id": null,
    "metadata": {},
    "name": "UpdateMitigationViewQuery",
    "operationKind": "query",
    "text": "query UpdateMitigationViewQuery(\n  $mitigationId: ID!\n) {\n  node(id: $mitigationId) {\n    __typename\n    ... on Mitigation {\n      id\n      name\n      description\n      category\n      importance\n      state\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "126fe89ef3da933cfb7847ff05179832";

export default node;
