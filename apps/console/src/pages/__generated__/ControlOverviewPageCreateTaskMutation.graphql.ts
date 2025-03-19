/**
 * @generated SignedSource<<f972be1746bd5bb9d5100845096188f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskState = "DONE" | "TODO";
export type CreateTaskInput = {
  assignedToId?: string | null | undefined;
  controlId: string;
  description: string;
  name: string;
  timeEstimate: any;
};
export type ControlOverviewPageCreateTaskMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateTaskInput;
};
export type ControlOverviewPageCreateTaskMutation$data = {
  readonly createTask: {
    readonly taskEdge: {
      readonly node: {
        readonly assignedTo: {
          readonly fullName: string;
          readonly id: string;
          readonly primaryEmailAddress: string;
        } | null | undefined;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly state: TaskState;
        readonly timeEstimate: any;
        readonly version: number;
      };
    };
  };
};
export type ControlOverviewPageCreateTaskMutation = {
  response: ControlOverviewPageCreateTaskMutation$data;
  variables: ControlOverviewPageCreateTaskMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
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
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
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
          "name": "state",
          "storageKey": null
        },
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
            (v3/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ControlOverviewPageCreateTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateTaskPayload",
        "kind": "LinkedField",
        "name": "createTask",
        "plural": false,
        "selections": [
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ControlOverviewPageCreateTaskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateTaskPayload",
        "kind": "LinkedField",
        "name": "createTask",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "taskEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ea82092f026318c66f62c910449be445",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageCreateTaskMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageCreateTaskMutation(\n  $input: CreateTaskInput!\n) {\n  createTask(input: $input) {\n    taskEdge {\n      node {\n        id\n        name\n        description\n        timeEstimate\n        state\n        version\n        assignedTo {\n          id\n          fullName\n          primaryEmailAddress\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1587bb98852e8a5ff4e4d6cb408f4d1e";

export default node;
