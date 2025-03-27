/**
 * @generated SignedSource<<4aed09b28d5d1ec083abfeeb874b9ce3>>
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
  timeEstimate?: any | null | undefined;
};
export type MitigationViewUpdateTaskStateMutation$variables = {
  input: UpdateTaskInput;
};
export type MitigationViewUpdateTaskStateMutation$data = {
  readonly updateTask: {
    readonly task: {
      readonly id: string;
      readonly state: TaskState;
      readonly timeEstimate: any | null | undefined;
      readonly version: number;
    };
  };
};
export type MitigationViewUpdateTaskStateMutation = {
  response: MitigationViewUpdateTaskStateMutation$data;
  variables: MitigationViewUpdateTaskStateMutation$variables;
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
    "name": "MitigationViewUpdateTaskStateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewUpdateTaskStateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8de0d061237d4ebcbb366b8eefff6d94",
    "id": null,
    "metadata": {},
    "name": "MitigationViewUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewUpdateTaskStateMutation(\n  $input: UpdateTaskInput!\n) {\n  updateTask(input: $input) {\n    task {\n      id\n      state\n      timeEstimate\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "81dca6c475859526370ef60b4757428b";

export default node;
