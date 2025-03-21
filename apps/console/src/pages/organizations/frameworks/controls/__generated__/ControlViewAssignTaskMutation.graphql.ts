/**
 * @generated SignedSource<<18bc7a503d34d2bcb4cdfb6b4cfc1912>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssignTaskInput = {
  assignedToId: string;
  taskId: string;
};
export type ControlViewAssignTaskMutation$variables = {
  input: AssignTaskInput;
};
export type ControlViewAssignTaskMutation$data = {
  readonly assignTask: {
    readonly task: {
      readonly assignedTo: {
        readonly fullName: string;
        readonly id: string;
        readonly primaryEmailAddress: string;
      } | null | undefined;
      readonly id: string;
      readonly version: number;
    };
  };
};
export type ControlViewAssignTaskMutation = {
  response: ControlViewAssignTaskMutation$data;
  variables: ControlViewAssignTaskMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AssignTaskPayload",
    "kind": "LinkedField",
    "name": "assignTask",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "version",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "assignedTo",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "primaryEmailAddress",
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
    "name": "ControlViewAssignTaskMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlViewAssignTaskMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0a406c0e166607d86896adc0dfb5618e",
    "id": null,
    "metadata": {},
    "name": "ControlViewAssignTaskMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewAssignTaskMutation(\n  $input: AssignTaskInput!\n) {\n  assignTask(input: $input) {\n    task {\n      id\n      version\n      assignedTo {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1a9a18038c2f6ad39d3efe61d2d0e33d";

export default node;
