/**
 * @generated SignedSource<<5223ef96f75ea5f5d4b124d190dfd455>>
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
export type UpdateControlViewUpdateControlMutation$variables = {
  input: UpdateControlInput;
};
export type UpdateControlViewUpdateControlMutation$data = {
  readonly updateControl: {
    readonly control: {
      readonly category: string;
      readonly description: string;
      readonly id: string;
      readonly importance: ControlImportance;
      readonly name: string;
      readonly state: ControlState;
      readonly version: number;
    };
  };
};
export type UpdateControlViewUpdateControlMutation = {
  response: UpdateControlViewUpdateControlMutation$data;
  variables: UpdateControlViewUpdateControlMutation$variables;
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
            "name": "importance",
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
    "name": "UpdateControlViewUpdateControlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateControlViewUpdateControlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1702f16b6cc6452422c0f72acee25359",
    "id": null,
    "metadata": {},
    "name": "UpdateControlViewUpdateControlMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateControlViewUpdateControlMutation(\n  $input: UpdateControlInput!\n) {\n  updateControl(input: $input) {\n    control {\n      id\n      name\n      description\n      category\n      importance\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e0f0940fe564406ef95473420b336128";

export default node;
