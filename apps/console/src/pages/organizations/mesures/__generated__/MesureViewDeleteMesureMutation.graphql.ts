/**
 * @generated SignedSource<<d2f54e72111c91de1b3fe8ece42a4f07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteMesureInput = {
  mesureId: string;
};
export type MesureViewDeleteMesureMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteMesureInput;
};
export type MesureViewDeleteMesureMutation$data = {
  readonly deleteMesure: {
    readonly deletedMesureId: string;
  };
};
export type MesureViewDeleteMesureMutation = {
  response: MesureViewDeleteMesureMutation$data;
  variables: MesureViewDeleteMesureMutation$variables;
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
  "kind": "ScalarField",
  "name": "deletedMesureId",
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
    "name": "MesureViewDeleteMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteMesurePayload",
        "kind": "LinkedField",
        "name": "deleteMesure",
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
    "name": "MesureViewDeleteMesureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteMesurePayload",
        "kind": "LinkedField",
        "name": "deleteMesure",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedMesureId",
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
    "cacheID": "075b3e2d23906985e70fa5ccd3b623c7",
    "id": null,
    "metadata": {},
    "name": "MesureViewDeleteMesureMutation",
    "operationKind": "mutation",
    "text": "mutation MesureViewDeleteMesureMutation(\n  $input: DeleteMesureInput!\n) {\n  deleteMesure(input: $input) {\n    deletedMesureId\n  }\n}\n"
  }
};
})();

(node as any).hash = "abf5ae3a6720522aee6b8d672ac389ef";

export default node;
