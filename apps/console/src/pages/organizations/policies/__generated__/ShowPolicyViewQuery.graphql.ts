/**
 * @generated SignedSource<<351444982c4868267f30cc9fc8a2399a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PolicyStatus = "DRAFT" | "PUBLISHED";
export type ShowPolicyViewQuery$variables = {
  policyId: string;
};
export type ShowPolicyViewQuery$data = {
  readonly node: {
    readonly createdAt?: string;
    readonly currentPublishedVersion?: number | null | undefined;
    readonly description?: string;
    readonly id: string;
    readonly latestVersion?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly changelog: string;
          readonly content: string;
          readonly createdAt: string;
          readonly id: string;
          readonly publishedAt: string | null | undefined;
          readonly publishedBy: {
            readonly fullName: string;
          } | null | undefined;
          readonly status: PolicyStatus;
          readonly updatedAt: string;
          readonly version: number;
        };
      }>;
    };
    readonly owner?: {
      readonly fullName: string;
      readonly id: string;
      readonly primaryEmailAddress: string;
    };
    readonly title?: string;
    readonly updatedAt?: string;
    readonly " $fragmentSpreads": FragmentRefs<"SignaturesModal_policyVersions" | "VersionHistoryModal_policyVersions">;
  };
};
export type ShowPolicyViewQuery = {
  response: ShowPolicyViewQuery$data;
  variables: ShowPolicyViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "policyId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "policyId"
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
  "name": "title",
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
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currentPublishedVersion",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "owner",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v8/*: any*/),
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
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "changelog",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "publishedAt",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v17 = [
  (v8/*: any*/),
  (v2/*: any*/)
],
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "publishedBy",
  "plural": false,
  "selections": (v17/*: any*/),
  "storageKey": null
},
v19 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowPolicyViewQuery",
    "selections": [
      {
        "alias": null,
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
              (v9/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SignaturesModal_policyVersions"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "VersionHistoryModal_policyVersions"
              },
              {
                "alias": "latestVersion",
                "args": (v10/*: any*/),
                "concreteType": "PolicyVersionConnection",
                "kind": "LinkedField",
                "name": "versions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PolicyVersionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PolicyVersion",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "People",
                            "kind": "LinkedField",
                            "name": "publishedBy",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "versions(first:1)"
              }
            ],
            "type": "Policy",
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
    "name": "ShowPolicyViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v9/*: any*/),
              {
                "alias": "policyVersions",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10
                  }
                ],
                "concreteType": "PolicyVersionConnection",
                "kind": "LinkedField",
                "name": "versions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PolicyVersionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PolicyVersion",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v15/*: any*/),
                          (v6/*: any*/),
                          (v18/*: any*/),
                          {
                            "alias": null,
                            "args": (v19/*: any*/),
                            "concreteType": "PolicyVersionSignatureConnection",
                            "kind": "LinkedField",
                            "name": "signatures",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "PolicyVersionSignatureEdge",
                                "kind": "LinkedField",
                                "name": "edges",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "PolicyVersionSignature",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v2/*: any*/),
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
                                        "name": "signedAt",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "requestedAt",
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "People",
                                        "kind": "LinkedField",
                                        "name": "signedBy",
                                        "plural": false,
                                        "selections": (v17/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "People",
                                        "kind": "LinkedField",
                                        "name": "requestedBy",
                                        "plural": false,
                                        "selections": (v17/*: any*/),
                                        "storageKey": null
                                      },
                                      (v16/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "cursor",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
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
                              }
                            ],
                            "storageKey": "signatures(first:100)"
                          },
                          {
                            "alias": null,
                            "args": (v19/*: any*/),
                            "filters": null,
                            "handle": "connection",
                            "key": "SignaturesModal_policyVersions_signatures",
                            "kind": "LinkedHandle",
                            "name": "signatures"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "versions(first:10)"
              },
              {
                "alias": "versionHistory",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 20
                  }
                ],
                "concreteType": "PolicyVersionConnection",
                "kind": "LinkedField",
                "name": "versions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PolicyVersionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PolicyVersion",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v6/*: any*/),
                          (v18/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "versions(first:20)"
              },
              {
                "alias": "latestVersion",
                "args": (v10/*: any*/),
                "concreteType": "PolicyVersionConnection",
                "kind": "LinkedField",
                "name": "versions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PolicyVersionEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PolicyVersion",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v11/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v18/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "versions(first:1)"
              }
            ],
            "type": "Policy",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "751e6cc23218ca2da7b5bf44d3eef59c",
    "id": null,
    "metadata": {},
    "name": "ShowPolicyViewQuery",
    "operationKind": "query",
    "text": "query ShowPolicyViewQuery(\n  $policyId: ID!\n) {\n  node(id: $policyId) {\n    __typename\n    id\n    ... on Policy {\n      title\n      description\n      createdAt\n      updatedAt\n      currentPublishedVersion\n      owner {\n        id\n        fullName\n        primaryEmailAddress\n      }\n      ...SignaturesModal_policyVersions\n      ...VersionHistoryModal_policyVersions\n      latestVersion: versions(first: 1) {\n        edges {\n          node {\n            id\n            version\n            status\n            content\n            changelog\n            publishedAt\n            publishedBy {\n              fullName\n              id\n            }\n            createdAt\n            updatedAt\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment SignaturesModal_policyVersions on Policy {\n  title\n  policyVersions: versions(first: 10) {\n    edges {\n      node {\n        id\n        version\n        status\n        publishedAt\n        updatedAt\n        publishedBy {\n          fullName\n          id\n        }\n        signatures(first: 100) {\n          edges {\n            node {\n              id\n              state\n              signedAt\n              requestedAt\n              signedBy {\n                fullName\n                id\n              }\n              requestedBy {\n                fullName\n                id\n              }\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment VersionHistoryModal_policyVersions on Policy {\n  title\n  owner {\n    fullName\n    id\n  }\n  versionHistory: versions(first: 20) {\n    edges {\n      node {\n        id\n        version\n        status\n        content\n        changelog\n        publishedAt\n        updatedAt\n        publishedBy {\n          fullName\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "58adb8690071648aecb252b2f807ea7d";

export default node;
