/**
 * @generated SignedSource<<42dcc8ca7d9ad288321e73fa5175db44>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type ControlState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type UpdateControlInput = {
  category?: string | null | undefined;
  description?: string | null | undefined;
  expectedVersion: number;
  id: string;
  importance?: ControlImportance | null | undefined;
  name?: string | null | undefined;
  state?: ControlState | null | undefined;
};
export type ControlViewUpdateControlStateMutation$variables = {
  input: UpdateControlInput;
};
export type ControlViewUpdateControlStateMutation$data = {
  readonly updateControl: {
    readonly control: {
      readonly id: string;
      readonly state: ControlState;
      readonly version: number;
    };
  };
};
export type ControlViewUpdateControlStateMutation = {
  response: ControlViewUpdateControlStateMutation$data;
  variables: ControlViewUpdateControlStateMutation$variables;
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
    "concreteType": "UpdateControlPayload",
    "kind": "LinkedField",
    "name": "updateControl",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Control",
        "kind": "LinkedField",
        "name": "control",
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
    "name": "ControlViewUpdateControlStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlViewUpdateControlStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b34b9c0ddec55d16efcc2f38e8334773",
    "id": null,
    "metadata": {},
    "name": "ControlViewUpdateControlStateMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewUpdateControlStateMutation(\n  $input: UpdateControlInput!\n) {\n  updateControl(input: $input) {\n    control {\n      id\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3eaaab55403bfaf343d4a740ad0128e1";

export default node;
