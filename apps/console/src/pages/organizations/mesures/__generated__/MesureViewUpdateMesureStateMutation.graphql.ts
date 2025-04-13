/**
 * @generated SignedSource<<9dac57f235ab6d16f6b3f78002c83dcc>>
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
export type MesureViewUpdateMesureStateMutation$variables = {
  input: UpdateMesureInput;
};
export type MesureViewUpdateMesureStateMutation$data = {
  readonly updateMesure: {
    readonly mesure: {
      readonly id: string;
      readonly state: MesureState;
    };
  };
};
export type MesureViewUpdateMesureStateMutation = {
  response: MesureViewUpdateMesureStateMutation$data;
  variables: MesureViewUpdateMesureStateMutation$variables;
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
            "name": "state",
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
    "name": "MesureViewUpdateMesureStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MesureViewUpdateMesureStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "59db8143f555230677a401f5bed6a6c3",
    "id": null,
    "metadata": {},
    "name": "MesureViewUpdateMesureStateMutation",
    "operationKind": "mutation",
    "text": "mutation MesureViewUpdateMesureStateMutation(\n  $input: UpdateMesureInput!\n) {\n  updateMesure(input: $input) {\n    mesure {\n      id\n      state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ae0f63f654568f052621f28e73382172";

export default node;
