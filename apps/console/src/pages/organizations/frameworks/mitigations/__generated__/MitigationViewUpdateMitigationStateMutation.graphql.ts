/**
 * @generated SignedSource<<1d924bb487fd93636fa7207c5aa08cdc>>
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
    "cacheID": "7e4a92a089fa5927b0239004c3fb5f47",
    "id": null,
    "metadata": {},
    "name": "MitigationViewUpdateMitigationStateMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewUpdateMitigationStateMutation(\n  $input: UpdateMitigationInput!\n) {\n  updateMitigation(input: $input) {\n    mitigation {\n      id\n      state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e985902d55a537a08b8a2d4482abe0b3";

export default node;
