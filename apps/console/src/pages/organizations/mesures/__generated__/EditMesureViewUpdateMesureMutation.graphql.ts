/**
 * @generated SignedSource<<869dc4adbc0716aa90912098821ce101>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MesureImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MesureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type UpdateMesureInput = {
  category?: string | null | undefined;
  description?: string | null | undefined;
  id: string;
  importance?: MesureImportance | null | undefined;
  name?: string | null | undefined;
  state?: MesureState | null | undefined;
};
export type EditMesureViewUpdateMesureMutation$variables = {
  input: UpdateMesureInput;
};
export type EditMesureViewUpdateMesureMutation$data = {
  readonly updateMesure: {
    readonly mesure: {
      readonly description: string;
      readonly id: string;
      readonly name: string;
    };
  };
};
export type EditMesureViewUpdateMesureMutation = {
  response: EditMesureViewUpdateMesureMutation$data;
  variables: EditMesureViewUpdateMesureMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateMesurePayload",
    "kind": "LinkedField",
    "name": "updateMesure",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Mesure",
        "kind": "LinkedField",
        "name": "mesure",
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditMesureViewUpdateMesureMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditMesureViewUpdateMesureMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ab674147338f145102c150b220578304",
    "id": null,
    "metadata": {},
    "name": "EditMesureViewUpdateMesureMutation",
    "operationKind": "mutation",
    "text": "mutation EditMesureViewUpdateMesureMutation(\n  $input: UpdateMesureInput!\n) {\n  updateMesure(input: $input) {\n    mesure {\n      id\n      name\n      description\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5f00ce5e7a705abecd93b06e727d5587";

export default node;
