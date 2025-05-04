/**
 * @generated SignedSource<<09afc0438feb0aa6a5a8a95f93d70951>>
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
  organizationId: string;
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
  readonly organization: {
    readonly name?: string;
  };
};
export type ShowPolicyViewQuery = {
  response: ShowPolicyViewQuery$data;
  variables: ShowPolicyViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "policyId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "organizationId"
  }
],
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "policyId"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currentPublishedVersion",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "owner",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    (v11/*: any*/),
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
v13 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "version",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "content",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "changelog",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "publishedAt",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v20 = [
  (v11/*: any*/),
  (v5/*: any*/)
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "publishedBy",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v22 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowPolicyViewQuery",
    "selections": [
      {
        "alias": "organization",
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v12/*: any*/),
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
                "args": (v13/*: any*/),
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
                          (v5/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "People",
                            "kind": "LinkedField",
                            "name": "publishedBy",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/),
                          (v9/*: any*/)
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ShowPolicyViewQuery",
    "selections": [
      {
        "alias": "organization",
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v19/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v19/*: any*/),
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v12/*: any*/),
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
                          (v5/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v18/*: any*/),
                          (v9/*: any*/),
                          (v21/*: any*/),
                          {
                            "alias": null,
                            "args": (v22/*: any*/),
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
                                      (v5/*: any*/),
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
                                        "selections": (v20/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "People",
                                        "kind": "LinkedField",
                                        "name": "requestedBy",
                                        "plural": false,
                                        "selections": (v20/*: any*/),
                                        "storageKey": null
                                      },
                                      (v19/*: any*/)
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
                            "args": (v22/*: any*/),
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
                          (v5/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v9/*: any*/),
                          (v21/*: any*/)
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
                "args": (v13/*: any*/),
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
                          (v5/*: any*/),
                          (v14/*: any*/),
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v21/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/)
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
    "cacheID": "643b6f01d617d7f7fa6995afe4960c3c",
    "id": null,
    "metadata": {},
    "name": "ShowPolicyViewQuery",
    "operationKind": "query",
    "text": "query ShowPolicyViewQuery(\n  $policyId: ID!\n  $organizationId: ID!\n) {\n  organization: node(id: $organizationId) {\n    __typename\n    ... on Organization {\n      name\n    }\n    id\n  }\n  node(id: $policyId) {\n    __typename\n    id\n    ... on Policy {\n      title\n      description\n      createdAt\n      updatedAt\n      currentPublishedVersion\n      owner {\n        id\n        fullName\n        primaryEmailAddress\n      }\n      ...SignaturesModal_policyVersions\n      ...VersionHistoryModal_policyVersions\n      latestVersion: versions(first: 1) {\n        edges {\n          node {\n            id\n            version\n            status\n            content\n            changelog\n            publishedAt\n            publishedBy {\n              fullName\n              id\n            }\n            createdAt\n            updatedAt\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment SignaturesModal_policyVersions on Policy {\n  title\n  policyVersions: versions(first: 10) {\n    edges {\n      node {\n        id\n        version\n        status\n        publishedAt\n        updatedAt\n        publishedBy {\n          fullName\n          id\n        }\n        signatures(first: 100) {\n          edges {\n            node {\n              id\n              state\n              signedAt\n              requestedAt\n              signedBy {\n                fullName\n                id\n              }\n              requestedBy {\n                fullName\n                id\n              }\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment VersionHistoryModal_policyVersions on Policy {\n  title\n  owner {\n    fullName\n    id\n  }\n  versionHistory: versions(first: 20) {\n    edges {\n      node {\n        id\n        version\n        status\n        content\n        changelog\n        publishedAt\n        updatedAt\n        publishedBy {\n          fullName\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "56b534c0a468ccee10939c7d6c731bfd";

export default node;
