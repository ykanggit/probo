/**
 * @generated SignedSource<<a6b1be8aa499bb8709a4d4e04edb01b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type PolicyStatus = "ACTIVE" | "DRAFT";
export type ShowRiskViewQuery$variables = {
  riskId: string;
};
export type ShowRiskViewQuery$data = {
  readonly node: {
    readonly controls?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly createdAt: string;
          readonly description: string;
          readonly id: string;
          readonly name: string;
          readonly referenceId: string;
        };
      }>;
    };
    readonly createdAt?: string;
    readonly description?: string;
    readonly id: string;
    readonly inherentImpact?: number;
    readonly inherentLikelihood?: number;
    readonly mitigations?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string;
          readonly createdAt: string;
          readonly description: string;
          readonly id: string;
          readonly name: string;
          readonly state: MitigationState;
        };
      }>;
    };
    readonly name?: string;
    readonly policies?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly createdAt: string;
          readonly id: string;
          readonly name: string;
          readonly status: PolicyStatus;
        };
      }>;
    };
    readonly residualImpact?: number;
    readonly residualLikelihood?: number;
    readonly updatedAt?: string;
  };
};
export type ShowRiskViewQuery = {
  response: ShowRiskViewQuery$data;
  variables: ShowRiskViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "riskId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "riskId"
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
  "name": "inherentLikelihood",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "inherentImpact",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "residualLikelihood",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "residualImpact",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
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
v14 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MitigationEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Mitigation",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
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
  (v13/*: any*/)
],
v15 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "PolicyEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Policy",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          (v9/*: any*/),
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ],
    "storageKey": null
  },
  (v13/*: any*/)
],
v16 = [
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "referenceId",
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          (v9/*: any*/),
          (v11/*: any*/)
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ],
    "storageKey": null
  },
  (v13/*: any*/)
],
v17 = [
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
    "name": "ShowRiskViewQuery",
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
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": "mitigations",
                "args": null,
                "concreteType": "MitigationConnection",
                "kind": "LinkedField",
                "name": "__Risk__mitigations_connection",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              {
                "alias": "policies",
                "args": null,
                "concreteType": "PolicyConnection",
                "kind": "LinkedField",
                "name": "__Risk__policies_connection",
                "plural": false,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": "controls",
                "args": null,
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "__Risk__controls_connection",
                "plural": false,
                "selections": (v16/*: any*/),
                "storageKey": null
              }
            ],
            "type": "Risk",
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
    "name": "ShowRiskViewQuery",
    "selections": [
      {
        "alias": null,
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
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "alias": null,
                "args": (v17/*: any*/),
                "concreteType": "MitigationConnection",
                "kind": "LinkedField",
                "name": "mitigations",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": "mitigations(first:100)"
              },
              {
                "alias": null,
                "args": (v17/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Risk__mitigations",
                "kind": "LinkedHandle",
                "name": "mitigations"
              },
              {
                "alias": null,
                "args": (v17/*: any*/),
                "concreteType": "PolicyConnection",
                "kind": "LinkedField",
                "name": "policies",
                "plural": false,
                "selections": (v15/*: any*/),
                "storageKey": "policies(first:100)"
              },
              {
                "alias": null,
                "args": (v17/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Risk__policies",
                "kind": "LinkedHandle",
                "name": "policies"
              },
              {
                "alias": null,
                "args": (v17/*: any*/),
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "controls",
                "plural": false,
                "selections": (v16/*: any*/),
                "storageKey": "controls(first:100)"
              },
              {
                "alias": null,
                "args": (v17/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Risk__controls",
                "kind": "LinkedHandle",
                "name": "controls"
              }
            ],
            "type": "Risk",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4463fac13f91564f513bfdabcc3e0063",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "mitigations"
          ]
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "policies"
          ]
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "controls"
          ]
        }
      ]
    },
    "name": "ShowRiskViewQuery",
    "operationKind": "query",
    "text": "query ShowRiskViewQuery(\n  $riskId: ID!\n) {\n  node(id: $riskId) {\n    __typename\n    id\n    ... on Risk {\n      name\n      description\n      inherentLikelihood\n      inherentImpact\n      residualLikelihood\n      residualImpact\n      createdAt\n      updatedAt\n      mitigations(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            category\n            createdAt\n            state\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      policies(first: 100) {\n        edges {\n          node {\n            id\n            name\n            status\n            createdAt\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      controls(first: 100) {\n        edges {\n          node {\n            id\n            referenceId\n            name\n            description\n            createdAt\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "68db9a4877abc338711844de6da38cb7";

export default node;
