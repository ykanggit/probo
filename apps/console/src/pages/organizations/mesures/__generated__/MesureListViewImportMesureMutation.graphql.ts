/**
 * @generated SignedSource<<251663bea47f61a5857366afa4cc0d28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MesureImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MesureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type ImportMesureInput = {
  file: any;
  organizationId: string;
};
export type MesureListViewImportMesureMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportMesureInput;
};
export type MesureListViewImportMesureMutation$data = {
  readonly importMesure: {
    readonly mesureEdges: ReadonlyArray<{
      readonly node: {
        readonly category: string;
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly importance: MesureImportance;
        readonly name: string;
        readonly state: MesureState;
        readonly updatedAt: string;
      };
    }>;
  };
};
export type MesureListViewImportMesureMutation = {
  response: MesureListViewImportMesureMutation$data;
  variables: MesureListViewImportMesureMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "MesureEdge",
  "kind": "LinkedField",
  "name": "mesureEdges",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Mesure",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "category",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "state",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "importance",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MesureListViewImportMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportMesurePayload",
        "kind": "LinkedField",
        "name": "importMesure",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "MesureListViewImportMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportMesurePayload",
        "kind": "LinkedField",
        "name": "importMesure",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "mesureEdges",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "179ac701005009dc5f30388570061264",
    "id": null,
    "metadata": {},
    "name": "MesureListViewImportMesureMutation",
    "operationKind": "mutation",
    "text": "mutation MesureListViewImportMesureMutation(\n  $input: ImportMesureInput!\n) {\n  importMesure(input: $input) {\n    mesureEdges {\n      node {\n        id\n        name\n        description\n        category\n        state\n        importance\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c1c9deeaa806b9553b7eb25d8832818c";

export default node;
