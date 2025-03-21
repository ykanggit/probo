/**
 * @generated SignedSource<<ec9f52c0ab13cd30148d7b2a97f59b63>>
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
export type ControlOverviewPageUnassignTaskMutation$variables = {
  input: UnassignTaskInput;
};
export type ControlOverviewPageUnassignTaskMutation$data = {
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
export type ControlOverviewPageUnassignTaskMutation = {
  response: ControlOverviewPageUnassignTaskMutation$data;
  variables: ControlOverviewPageUnassignTaskMutation$variables;
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
    "name": "ControlOverviewPageUnassignTaskMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlOverviewPageUnassignTaskMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "dc570710d28f3208dbaff23593819f4d",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUnassignTaskMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUnassignTaskMutation(\n  $input: UnassignTaskInput!\n) {\n  unassignTask(input: $input) {\n    task {\n      id\n      version\n      assignedTo {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4c809cd810a4178ab4f7a6d020338187";

export default node;
