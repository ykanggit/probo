/**
 * @generated SignedSource<<c8807fd1479464c46122e4ca904713f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type ShowRiskViewQuery$variables = {
  riskId: string;
};
export type ShowRiskViewQuery$data = {
  readonly node: {
    readonly createdAt?: string;
    readonly description?: string;
    readonly id: string;
    readonly impact?: number;
    readonly mitigations?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string;
          readonly description: string;
          readonly id: string;
          readonly importance: MitigationImportance;
          readonly name: string;
          readonly state: MitigationState;
        };
      }>;
    };
    readonly name?: string;
    readonly probability?: number;
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
  "kind": "InlineFragment",
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "probability",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "impact",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "updatedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "MitigationConnection",
      "kind": "LinkedField",
      "name": "mitigations",
      "plural": false,
      "selections": [
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "importance",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "state",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "mitigations(first:100)"
    }
  ],
  "type": "Risk",
  "abstractKey": null
};
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
          (v5/*: any*/)
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1fa87a20a3f945fa7da2f72e5b4fa52f",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewQuery",
    "operationKind": "query",
    "text": "query ShowRiskViewQuery(\n  $riskId: ID!\n) {\n  node(id: $riskId) {\n    __typename\n    id\n    ... on Risk {\n      name\n      description\n      probability\n      impact\n      createdAt\n      updatedAt\n      mitigations(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            category\n            importance\n            state\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "824859cf39078da910b00879c17a2a9d";

export default node;
