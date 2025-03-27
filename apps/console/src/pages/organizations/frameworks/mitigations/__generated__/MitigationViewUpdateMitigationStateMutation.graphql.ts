/**
 * @generated SignedSource<<3aa56a1042b1f9492cfc5bd5d5f55d9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type UpdateMitigationInput = {
  category?: string | null | undefined;
  description?: string | null | undefined;
  expectedVersion: number;
  id: string;
  importance?: MitigationImportance | null | undefined;
  name?: string | null | undefined;
  state?: MitigationState | null | undefined;
};
export type MitigationViewUpdateMitigationStateMutation$variables = {
  input: UpdateMitigationInput;
};
export type MitigationViewUpdateMitigationStateMutation$data = {
  readonly updateMitigation: {
    readonly mitigation: {
      readonly id: string;
      readonly state: MitigationState;
      readonly version: number;
    };
  };
};
export type MitigationViewUpdateMitigationStateMutation = {
  response: MitigationViewUpdateMitigationStateMutation$data;
  variables: MitigationViewUpdateMitigationStateMutation$variables;
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
    "concreteType": "UpdateMitigationPayload",
    "kind": "LinkedField",
    "name": "updateMitigation",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Mitigation",
        "kind": "LinkedField",
        "name": "mitigation",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "version",
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
    "name": "MitigationViewUpdateMitigationStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewUpdateMitigationStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4a85c6e15d6ff91ccaa7976f9b0a0c6f",
    "id": null,
    "metadata": {},
    "name": "MitigationViewUpdateMitigationStateMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewUpdateMitigationStateMutation(\n  $input: UpdateMitigationInput!\n) {\n  updateMitigation(input: $input) {\n    mitigation {\n      id\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2eb2c1f791262f502df22ca0c16682a7";

export default node;
