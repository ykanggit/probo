/**
 * @generated SignedSource<<efb9132cf25dca5dff1df4fa6f139cd1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskState = "DONE" | "TODO";
export type UpdateTaskInput = {
  description?: string | null | undefined;
  name?: string | null | undefined;
  state?: TaskState | null | undefined;
  taskId: string;
  timeEstimate?: any | null | undefined;
};
export type MesureViewUpdateTaskStateMutation$variables = {
  input: UpdateTaskInput;
};
export type MesureViewUpdateTaskStateMutation$data = {
  readonly updateTask: {
    readonly task: {
      readonly id: string;
      readonly state: TaskState;
      readonly timeEstimate: any | null | undefined;
    };
  };
};
export type MesureViewUpdateTaskStateMutation = {
  response: MesureViewUpdateTaskStateMutation$data;
  variables: MesureViewUpdateTaskStateMutation$variables;
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
    "concreteType": "UpdateTaskPayload",
    "kind": "LinkedField",
    "name": "updateTask",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "timeEstimate",
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
    "name": "MesureViewUpdateTaskStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MesureViewUpdateTaskStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3af3e26a5c5be4c129b6d1706d3d1b59",
    "id": null,
    "metadata": {},
    "name": "MesureViewUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation MesureViewUpdateTaskStateMutation(\n  $input: UpdateTaskInput!\n) {\n  updateTask(input: $input) {\n    task {\n      id\n      state\n      timeEstimate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd909d70346802420c83942efa30ef20";

export default node;
