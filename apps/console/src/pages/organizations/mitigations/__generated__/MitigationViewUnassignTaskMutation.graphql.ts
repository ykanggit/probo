/**
 * @generated SignedSource<<a0f8386de345c2c768657efd4358518c>>
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
export type MitigationViewUnassignTaskMutation$variables = {
  input: UnassignTaskInput;
};
export type MitigationViewUnassignTaskMutation$data = {
  readonly unassignTask: {
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
export type MitigationViewUnassignTaskMutation = {
  response: MitigationViewUnassignTaskMutation$data;
  variables: MitigationViewUnassignTaskMutation$variables;
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
    "name": "MitigationViewUnassignTaskMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewUnassignTaskMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6cf554a835936763f3b4f55f04c9771f",
    "id": null,
    "metadata": {},
    "name": "MitigationViewUnassignTaskMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewUnassignTaskMutation(\n  $input: UnassignTaskInput!\n) {\n  unassignTask(input: $input) {\n    task {\n      id\n      assignedTo {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "07d79596fef3416fdc001077d2d51c75";

export default node;
