/**
 * @generated SignedSource<<2ce0834e0bd8b3d2937b34ebf91f9a69>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
    readonly name?: string;
    readonly state?: ControlState;
    readonly tasks?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly description: string;
          readonly evidences: {
            readonly __id: string;
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly createdAt: string;
                readonly fileUrl: string;
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
        };
      }>;
    };
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
  "name": "category",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v9 = {
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
v10 = {
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
v11 = [
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
            "name": "fileUrl",
            "storageKey": null
          },
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
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      (v8/*: any*/)
    ],
    "storageKey": null
  },
  (v9/*: any*/),
  (v10/*: any*/)
],
v12 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v13 = [
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
                          {
                            "alias": "evidences",
                            "args": null,
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "__ControlOverviewPage_evidences_connection",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  (v10/*: any*/)
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
          (v7/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": (v12/*: any*/),
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
                          {
                            "alias": null,
                            "args": (v13/*: any*/),
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "evidences",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": "evidences(first:50)"
                          },
                          {
                            "alias": null,
                            "args": (v13/*: any*/),
                            "filters": null,
                            "handle": "connection",
                            "key": "ControlOverviewPage_evidences",
                            "kind": "LinkedHandle",
                            "name": "evidences"
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": "tasks(first:100)"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
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
    "cacheID": "9738657b3d99bf6d85fd5333972e68f1",
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
    "text": "query ControlOverviewPageQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n      description\n      state\n      category\n      tasks(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            state\n            evidences(first: 50) {\n              edges {\n                node {\n                  id\n                  fileUrl\n                  mimeType\n                  size\n                  state\n                  createdAt\n                  __typename\n                }\n                cursor\n              }\n              pageInfo {\n                endCursor\n                hasNextPage\n              }\n            }\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5c2829a1e6bc18d96db9e608fbfc4d6f";

export default node;
