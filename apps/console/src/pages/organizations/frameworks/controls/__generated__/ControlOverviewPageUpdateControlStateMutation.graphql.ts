/**
 * @generated SignedSource<<f8dd4ed041b15ddf484ff9b1735c69ed>>
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
export type ControlOverviewPageUpdateControlStateMutation$variables = {
  input: UpdateControlInput;
};
export type ControlOverviewPageUpdateControlStateMutation$data = {
  readonly updateControl: {
    readonly control: {
      readonly id: string;
      readonly state: ControlState;
      readonly version: number;
    };
  };
};
export type ControlOverviewPageUpdateControlStateMutation = {
  response: ControlOverviewPageUpdateControlStateMutation$data;
  variables: ControlOverviewPageUpdateControlStateMutation$variables;
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
    "name": "ControlOverviewPageUpdateControlStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlOverviewPageUpdateControlStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f119c567d66788b2e3bed77950602ab5",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUpdateControlStateMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUpdateControlStateMutation(\n  $input: UpdateControlInput!\n) {\n  updateControl(input: $input) {\n    control {\n      id\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a7792a068992b6e9b0c560426b8a99a4";

export default node;
