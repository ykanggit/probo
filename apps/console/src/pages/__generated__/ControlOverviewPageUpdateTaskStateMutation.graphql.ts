/**
 * @generated SignedSource<<168d543d518d84054b1f194ee13feeaa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskState = "DONE" | "TODO";
export type UpdateTaskStateInput = {
  state: TaskState;
  taskId: string;
};
export type ControlOverviewPageUpdateTaskStateMutation$variables = {
  input: UpdateTaskStateInput;
};
export type ControlOverviewPageUpdateTaskStateMutation$data = {
  readonly updateTaskState: {
    readonly task: {
      readonly id: string;
      readonly state: TaskState;
    };
  };
};
export type ControlOverviewPageUpdateTaskStateMutation = {
  response: ControlOverviewPageUpdateTaskStateMutation$data;
  variables: ControlOverviewPageUpdateTaskStateMutation$variables;
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
    "concreteType": "UpdateTaskStatePayload",
    "kind": "LinkedField",
    "name": "updateTaskState",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Task",
        "kind": "LinkedField",
        "name": "task",
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
    "name": "ControlOverviewPageUpdateTaskStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlOverviewPageUpdateTaskStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7099089b96d6ca450d88f0a3597b2203",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUpdateTaskStateMutation(\n  $input: UpdateTaskStateInput!\n) {\n  updateTaskState(input: $input) {\n    task {\n      id\n      state\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a81e1f58fa9931a70b85633b6ad0bd7a";

export default node;
