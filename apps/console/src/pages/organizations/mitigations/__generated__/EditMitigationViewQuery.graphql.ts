/**
 * @generated SignedSource<<851436cc3003fed7f1e384d153eff0b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type EditMitigationViewQuery$variables = {
  mitigationId: string;
};
export type EditMitigationViewQuery$data = {
  readonly node: {
    readonly category?: string;
    readonly description?: string;
    readonly id?: string;
    readonly importance?: MitigationImportance;
    readonly name?: string;
  };
};
export type EditMitigationViewQuery = {
  response: EditMitigationViewQuery$data;
  variables: EditMitigationViewQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditMitigationViewQuery",
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
    "name": "EditMitigationViewQuery",
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
            "type": "Mitigation",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "df8ca216b15dda843c6da7f82bc4fb37",
    "id": null,
    "metadata": {},
    "name": "EditMitigationViewQuery",
    "operationKind": "query",
    "text": "query EditMitigationViewQuery(\n  $mitigationId: ID!\n) {\n  node(id: $mitigationId) {\n    __typename\n    ... on Mitigation {\n      id\n      name\n      description\n      category\n      importance\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "bb3db4a2e4bcdcd77f8847d302f74340";

export default node;
