/**
 * @generated SignedSource<<21747064508d0bb73d846aed7ed6b97a>>
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
export type UpdateControlPageUpdateControlMutation$variables = {
  input: UpdateControlInput;
};
export type UpdateControlPageUpdateControlMutation$data = {
  readonly updateControl: {
    readonly control: {
      readonly category: string;
      readonly description: string;
      readonly id: string;
      readonly name: string;
      readonly state: ControlState;
      readonly version: number;
    };
  };
};
export type UpdateControlPageUpdateControlMutation = {
  response: UpdateControlPageUpdateControlMutation$data;
  variables: UpdateControlPageUpdateControlMutation$variables;
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
    "name": "UpdateControlPageUpdateControlMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateControlPageUpdateControlMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1e9e2b8000a1b3061fcfda07260413ed",
    "id": null,
    "metadata": {},
    "name": "UpdateControlPageUpdateControlMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateControlPageUpdateControlMutation(\n  $input: UpdateControlInput!\n) {\n  updateControl(input: $input) {\n    control {\n      id\n      name\n      description\n      category\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "861813b150cef2977f8d9455a9bcf4fa";

export default node;
