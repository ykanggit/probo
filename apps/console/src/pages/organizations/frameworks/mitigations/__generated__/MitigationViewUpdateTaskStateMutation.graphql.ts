/**
 * @generated SignedSource<<a68054962a4ec7ae205dc2976fe8d2bf>>
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
export type MitigationViewUpdateTaskStateMutation$variables = {
  input: UpdateTaskInput;
};
export type MitigationViewUpdateTaskStateMutation$data = {
  readonly updateTask: {
    readonly task: {
      readonly id: string;
      readonly state: TaskState;
      readonly timeEstimate: any | null | undefined;
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
    "cacheID": "f8d2ca86f8e7856b3d24bcd810490a6a",
    "id": null,
    "metadata": {},
    "name": "MitigationViewUpdateTaskStateMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewUpdateTaskStateMutation(\n  $input: UpdateTaskInput!\n) {\n  updateTask(input: $input) {\n    task {\n      id\n      state\n      timeEstimate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7ab07c94be8f56a93d39178828d85823";

export default node;
