/**
 * @generated SignedSource<<191b5c89c10a7d949997216a79f49598>>
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
    readonly taskEdge: {
      readonly node: {
        readonly id: string;
        readonly state: TaskState;
      };
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
        "concreteType": "TaskEdge",
        "kind": "LinkedField",
        "name": "taskEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Task",
            "kind": "LinkedField",
            "name": "node",
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
    "cacheID": "ea56b9c3f41a4b69a3643884f8f2306d",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUpdateTaskStateMutation(\n  $input: UpdateTaskStateInput!\n) {\n  updateTaskState(input: $input) {\n    taskEdge {\n      node {\n        id\n        state\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3113753b83cf06bd8aca41610c1e89fd";

export default node;
