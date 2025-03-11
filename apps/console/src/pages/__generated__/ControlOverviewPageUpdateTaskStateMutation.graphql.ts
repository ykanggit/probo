/**
 * @generated SignedSource<<c6eaf570ef3d4e5a289ab266f6662546>>
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
  expectedVersion: number;
  name?: string | null | undefined;
  state?: TaskState | null | undefined;
  taskId: string;
};
export type ControlOverviewPageUpdateTaskStateMutation$variables = {
  input: UpdateTaskInput;
};
export type ControlOverviewPageUpdateTaskStateMutation$data = {
  readonly updateTask: {
    readonly task: {
      readonly id: string;
      readonly state: TaskState;
      readonly version: number;
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
    "cacheID": "4ebc7b830cc1c2129ec26429ab681c44",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUpdateTaskStateMutation(\n  $input: UpdateTaskInput!\n) {\n  updateTask(input: $input) {\n    task {\n      id\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9a076b4306fee5793009ea3082e5cde2";

export default node;
