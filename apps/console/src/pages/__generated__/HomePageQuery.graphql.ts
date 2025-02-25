/**
 * @generated SignedSource<<d57e3b87db862a1cfa086ea4b410d567>>
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
export type HomePageQuery$variables = Record<PropertyKey, never>;
export type HomePageQuery$data = {
  readonly viewer: {
    readonly id: string;
    readonly organization: {
      readonly createdAt: any;
      readonly frameworks: {
        readonly edges: ReadonlyArray<{
          readonly cursor: any;
          readonly node: {
            readonly controls: {
              readonly edges: ReadonlyArray<{
                readonly node: {
                  readonly id: string;
                  readonly name: string;
                  readonly state: ControlState;
                  readonly stateTransisions: {
                    readonly edges: ReadonlyArray<{
                      readonly node: {
                        readonly createdAt: any;
                        readonly fromState: ControlState | null | undefined;
                        readonly id: string;
                        readonly toState: ControlState;
                        readonly updatedAt: any;
                      };
                    }>;
                  };
                  readonly tasks: {
                    readonly edges: ReadonlyArray<{
                      readonly node: {
                        readonly createdAt: any;
                        readonly evidences: {
                          readonly edges: ReadonlyArray<{
                            readonly node: {
                              readonly createdAt: any;
                              readonly fileUrl: string;
                              readonly id: string;
                              readonly state: EvidenceState;
                              readonly stateTransisions: {
                                readonly edges: ReadonlyArray<{
                                  readonly node: {
                                    readonly createdAt: any;
                                    readonly fromState: EvidenceState | null | undefined;
                                    readonly id: string;
                                    readonly reason: string | null | undefined;
                                    readonly toState: EvidenceState;
                                    readonly updatedAt: any;
                                  };
                                }>;
                              };
                              readonly updatedAt: any;
                            };
                          }>;
                        };
                        readonly id: string;
                        readonly name: string;
                        readonly state: TaskState;
                        readonly stateTransisions: {
                          readonly edges: ReadonlyArray<{
                            readonly node: {
                              readonly createdAt: any;
                              readonly fromState: TaskState | null | undefined;
                              readonly id: string;
                              readonly reason: string | null | undefined;
                              readonly toState: TaskState;
                              readonly updatedAt: any;
                            };
                          }>;
                        };
                        readonly updatedAt: any;
                      };
                    }>;
                  };
                };
              }>;
            };
            readonly description: string;
            readonly id: string;
            readonly name: string;
          };
        }>;
        readonly pageInfo: {
          readonly endCursor: any | null | undefined;
          readonly hasNextPage: boolean;
          readonly hasPreviousPage: boolean;
          readonly startCursor: any | null | undefined;
        };
      };
      readonly name: string;
      readonly peoples: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly additionalEmailAddresses: ReadonlyArray<string>;
            readonly createdAt: any;
            readonly fullName: string;
            readonly id: string;
            readonly primaryEmailAddress: string;
            readonly updatedAt: any;
          };
        }>;
      };
      readonly updatedAt: any;
      readonly vendors: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly createdAt: any;
            readonly id: string;
            readonly name: string;
            readonly updatedAt: any;
          };
        }>;
      };
    };
  };
};
export type HomePageQuery = {
  response: HomePageQuery$data;
  variables: HomePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "VendorConnection",
  "kind": "LinkedField",
  "name": "vendors",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "VendorEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Vendor",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "PeopleConnection",
  "kind": "LinkedField",
  "name": "peoples",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PeopleEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "People",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "additionalEmailAddresses",
              "storageKey": null
            },
            (v2/*: any*/),
            (v3/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "toState",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fromState",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reason",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "FrameworkConnection",
  "kind": "LinkedField",
  "name": "frameworks",
  "plural": false,
  "selections": [
    {
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
          "name": "hasNextPage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "hasPreviousPage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startCursor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endCursor",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FrameworkEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "cursor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Framework",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
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
              "concreteType": "ControlConnection",
              "kind": "LinkedField",
              "name": "controls",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "ControlEdge",
                  "kind": "LinkedField",
                  "name": "edges",
                  "plural": true,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Control",
                      "kind": "LinkedField",
                      "name": "node",
                      "plural": false,
                      "selections": [
                        (v0/*: any*/),
                        (v1/*: any*/),
                        (v6/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "ControlStateTransitionConnection",
                          "kind": "LinkedField",
                          "name": "stateTransisions",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "ControlStateTransitionEdge",
                              "kind": "LinkedField",
                              "name": "edges",
                              "plural": true,
                              "selections": [
                                {
                                  "alias": null,
                                  "args": null,
                                  "concreteType": "ControlStateTransition",
                                  "kind": "LinkedField",
                                  "name": "node",
                                  "plural": false,
                                  "selections": [
                                    (v0/*: any*/),
                                    (v7/*: any*/),
                                    (v8/*: any*/),
                                    (v2/*: any*/),
                                    (v3/*: any*/)
                                  ],
                                  "storageKey": null
                                }
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
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
                                    (v0/*: any*/),
                                    (v1/*: any*/),
                                    (v6/*: any*/),
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "EvidenceConnection",
                                      "kind": "LinkedField",
                                      "name": "evidences",
                                      "plural": false,
                                      "selections": [
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
                                                (v0/*: any*/),
                                                (v6/*: any*/),
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
                                                  "concreteType": "EvidenceStateTransitionConnection",
                                                  "kind": "LinkedField",
                                                  "name": "stateTransisions",
                                                  "plural": false,
                                                  "selections": [
                                                    {
                                                      "alias": null,
                                                      "args": null,
                                                      "concreteType": "EvidenceStateTransitionEdge",
                                                      "kind": "LinkedField",
                                                      "name": "edges",
                                                      "plural": true,
                                                      "selections": [
                                                        {
                                                          "alias": null,
                                                          "args": null,
                                                          "concreteType": "EvidenceStateTransition",
                                                          "kind": "LinkedField",
                                                          "name": "node",
                                                          "plural": false,
                                                          "selections": [
                                                            (v0/*: any*/),
                                                            (v8/*: any*/),
                                                            (v7/*: any*/),
                                                            (v9/*: any*/),
                                                            (v2/*: any*/),
                                                            (v3/*: any*/)
                                                          ],
                                                          "storageKey": null
                                                        }
                                                      ],
                                                      "storageKey": null
                                                    }
                                                  ],
                                                  "storageKey": null
                                                },
                                                (v2/*: any*/),
                                                (v3/*: any*/)
                                              ],
                                              "storageKey": null
                                            }
                                          ],
                                          "storageKey": null
                                        }
                                      ],
                                      "storageKey": null
                                    },
                                    {
                                      "alias": null,
                                      "args": null,
                                      "concreteType": "TaskStateTransitionConnection",
                                      "kind": "LinkedField",
                                      "name": "stateTransisions",
                                      "plural": false,
                                      "selections": [
                                        {
                                          "alias": null,
                                          "args": null,
                                          "concreteType": "TaskStateTransitionEdge",
                                          "kind": "LinkedField",
                                          "name": "edges",
                                          "plural": true,
                                          "selections": [
                                            {
                                              "alias": null,
                                              "args": null,
                                              "concreteType": "TaskStateTransition",
                                              "kind": "LinkedField",
                                              "name": "node",
                                              "plural": false,
                                              "selections": [
                                                (v0/*: any*/),
                                                (v7/*: any*/),
                                                (v8/*: any*/),
                                                (v9/*: any*/),
                                                (v2/*: any*/),
                                                (v3/*: any*/)
                                              ],
                                              "storageKey": null
                                            }
                                          ],
                                          "storageKey": null
                                        }
                                      ],
                                      "storageKey": null
                                    },
                                    (v2/*: any*/),
                                    (v3/*: any*/)
                                  ],
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
                  ],
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
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HomePageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v10/*: any*/)
            ],
            "storageKey": null
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HomePageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v10/*: any*/),
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9f8dd0b1a2698dd2d944e75de5d32087",
    "id": null,
    "metadata": {},
    "name": "HomePageQuery",
    "operationKind": "query",
    "text": "query HomePageQuery {\n  viewer {\n    id\n    organization {\n      name\n      createdAt\n      updatedAt\n      vendors {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            updatedAt\n          }\n        }\n      }\n      peoples {\n        edges {\n          node {\n            id\n            fullName\n            primaryEmailAddress\n            additionalEmailAddresses\n            createdAt\n            updatedAt\n          }\n        }\n      }\n      frameworks {\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n        edges {\n          cursor\n          node {\n            id\n            name\n            description\n            controls {\n              edges {\n                node {\n                  id\n                  name\n                  state\n                  stateTransisions {\n                    edges {\n                      node {\n                        id\n                        toState\n                        fromState\n                        createdAt\n                        updatedAt\n                      }\n                    }\n                  }\n                  tasks {\n                    edges {\n                      node {\n                        id\n                        name\n                        state\n                        evidences {\n                          edges {\n                            node {\n                              id\n                              state\n                              fileUrl\n                              stateTransisions {\n                                edges {\n                                  node {\n                                    id\n                                    fromState\n                                    toState\n                                    reason\n                                    createdAt\n                                    updatedAt\n                                  }\n                                }\n                              }\n                              createdAt\n                              updatedAt\n                            }\n                          }\n                        }\n                        stateTransisions {\n                          edges {\n                            node {\n                              id\n                              toState\n                              fromState\n                              reason\n                              createdAt\n                              updatedAt\n                            }\n                          }\n                        }\n                        createdAt\n                        updatedAt\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "875e681cb7e936d3f1a543e88c4cb2d0";

export default node;
