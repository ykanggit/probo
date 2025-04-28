/**
 * @generated SignedSource<<4c1c57380bf4ac13f476346c8bee05fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateMesureInput = {
  category: string;
  description: string;
  name: string;
  organizationId: string;
};
export type NewMesureViewCreateMesureMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateMesureInput;
};
export type NewMesureViewCreateMesureMutation$data = {
  readonly createMesure: {
    readonly mesureEdge: {
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly name: string;
      };
    };
  };
};
export type NewMesureViewCreateMesureMutation = {
  response: NewMesureViewCreateMesureMutation$data;
  variables: NewMesureViewCreateMesureMutation$variables;
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
  "name": "mesureEdge",
  "plural": false,
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
    "name": "NewMesureViewCreateMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMesurePayload",
        "kind": "LinkedField",
        "name": "createMesure",
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
    "name": "NewMesureViewCreateMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMesurePayload",
        "kind": "LinkedField",
        "name": "createMesure",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "mesureEdge",
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
    "cacheID": "de8b930c9628c62ae4272bd427076ebd",
    "id": null,
    "metadata": {},
    "name": "NewMesureViewCreateMesureMutation",
    "operationKind": "mutation",
    "text": "mutation NewMesureViewCreateMesureMutation(\n  $input: CreateMesureInput!\n) {\n  createMesure(input: $input) {\n    mesureEdge {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "94532353875a658b6e0b87a8181eab5e";

export default node;
