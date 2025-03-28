/**
 * @generated SignedSource<<c176425ad01ae9a330d0b8217a54841f>>
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
export type MitigationViewAssignTaskMutation$variables = {
  input: AssignTaskInput;
};
export type MitigationViewAssignTaskMutation$data = {
  readonly assignTask: {
    readonly task: {
      readonly assignedTo: {
        readonly fullName: string;
        readonly id: string;
        readonly primaryEmailAddress: string;
      } | null | undefined;
      readonly id: string;
    };
  };
};
export type MitigationViewAssignTaskMutation = {
  response: MitigationViewAssignTaskMutation$data;
  variables: MitigationViewAssignTaskMutation$variables;
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
    "name": "MitigationViewAssignTaskMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewAssignTaskMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c01a2f758aea8268b73365c426b7c08a",
    "id": null,
    "metadata": {},
    "name": "MitigationViewAssignTaskMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewAssignTaskMutation(\n  $input: AssignTaskInput!\n) {\n  assignTask(input: $input) {\n    task {\n      id\n      assignedTo {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2b01502cb830a0d914553e01ceb2445f";

export default node;
