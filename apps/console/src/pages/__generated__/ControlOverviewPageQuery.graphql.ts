/**
 * @generated SignedSource<<84b34aa7e582728a8386d1fe1ef3fb58>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type ControlState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type EvidenceState = "EXPIRED" | "INVALID" | "VALID";
export type TaskState = "DONE" | "TODO";
export type ControlOverviewPageQuery$variables = {
  controlId: string;
};
export type ControlOverviewPageQuery$data = {
  readonly control: {
    readonly category?: string;
    readonly description?: string;
    readonly id: string;
    readonly importance?: ControlImportance;
    readonly name?: string;
    readonly state?: ControlState;
    readonly tasks?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly assignedTo: {
            readonly fullName: string;
            readonly id: string;
            readonly primaryEmailAddress: string;
          } | null | undefined;
          readonly description: string;
          readonly evidences: {
            readonly __id: string;
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly createdAt: string;
                readonly filename: string;
                readonly id: string;
                readonly mimeType: string;
                readonly size: number;
                readonly state: EvidenceState;
              };
            }>;
          };
          readonly id: string;
          readonly name: string;
          readonly state: TaskState;
          readonly timeEstimate: any;
          readonly version: number;
        };
      }>;
    };
    readonly version?: number;
  };
};
export type ControlOverviewPageQuery = {
  response: ControlOverviewPageQuery$data;
  variables: ControlOverviewPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "controlId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "controlId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "importance",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timeEstimate",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "assignedTo",
  "plural": false,
  "selections": [
    (v2/*: any*/),
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
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v14 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v15 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EvidenceEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Evidence",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mimeType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "filename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "size",
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ],
    "storageKey": null
  },
  (v13/*: any*/),
  (v14/*: any*/)
],
v16 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v17 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ControlOverviewPageQuery",
    "selections": [
      {
        "alias": "control",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": "tasks",
                "args": null,
                "concreteType": "TaskConnection",
                "kind": "LinkedField",
                "name": "__ControlOverviewPage_tasks_connection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TaskEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Task",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v9/*: any*/),
                          (v8/*: any*/),
                          (v10/*: any*/),
                          {
                            "alias": "evidences",
                            "args": null,
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "__ControlOverviewPage_evidences_connection",
                            "plural": false,
                            "selections": (v15/*: any*/),
                            "storageKey": null
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Control",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlOverviewPageQuery",
    "selections": [
      {
        "alias": "control",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": (v16/*: any*/),
                "concreteType": "TaskConnection",
                "kind": "LinkedField",
                "name": "tasks",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TaskEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Task",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v9/*: any*/),
                          (v8/*: any*/),
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": (v17/*: any*/),
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "evidences",
                            "plural": false,
                            "selections": (v15/*: any*/),
                            "storageKey": "evidences(first:50)"
                          },
                          {
                            "alias": null,
                            "args": (v17/*: any*/),
                            "filters": null,
                            "handle": "connection",
                            "key": "ControlOverviewPage_evidences",
                            "kind": "LinkedHandle",
                            "name": "evidences"
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": "tasks(first:100)"
              },
              {
                "alias": null,
                "args": (v16/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ControlOverviewPage_tasks",
                "kind": "LinkedHandle",
                "name": "tasks"
              }
            ],
            "type": "Control",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4bcea497959829f998cdab71797c8675",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": null
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "control",
            "tasks"
          ]
        }
      ]
    },
    "name": "ControlOverviewPageQuery",
    "operationKind": "query",
    "text": "query ControlOverviewPageQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n      description\n      state\n      importance\n      category\n      version\n      tasks(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            state\n            timeEstimate\n            version\n            assignedTo {\n              id\n              fullName\n              primaryEmailAddress\n            }\n            evidences(first: 50) {\n              edges {\n                node {\n                  id\n                  mimeType\n                  filename\n                  size\n                  state\n                  createdAt\n                  __typename\n                }\n                cursor\n              }\n              pageInfo {\n                endCursor\n                hasNextPage\n              }\n            }\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4710a9799b3daf286afdd430f026e6c2";

export default node;
