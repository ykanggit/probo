/**
 * @generated SignedSource<<c9adac41c9c5084befb16e9c01a12900>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UnassignTaskInput = {
  taskId: string;
};
export type ControlViewUnassignTaskMutation$variables = {
  input: UnassignTaskInput;
};
export type ControlViewUnassignTaskMutation$data = {
  readonly unassignTask: {
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
export type ControlViewUnassignTaskMutation = {
  response: ControlViewUnassignTaskMutation$data;
  variables: ControlViewUnassignTaskMutation$variables;
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
    "concreteType": "UnassignTaskPayload",
    "kind": "LinkedField",
    "name": "unassignTask",
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
    "name": "ControlViewUnassignTaskMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlViewUnassignTaskMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "15ebb533fa8c9ef25aba306106a198eb",
    "id": null,
    "metadata": {},
    "name": "ControlViewUnassignTaskMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewUnassignTaskMutation(\n  $input: UnassignTaskInput!\n) {\n  unassignTask(input: $input) {\n    task {\n      id\n      version\n      assignedTo {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b0956d42397dc015e2ece4ff37a83857";

export default node;
