/**
 * @generated SignedSource<<f60cb96210dc7db1b8617d7d4414a3d0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type MitigationListViewQuery$variables = {
  first?: number | null | undefined;
  organizationId: string;
};
export type MitigationListViewQuery$data = {
  readonly organization: {
    readonly id: string;
    readonly mitigations?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string;
          readonly createdAt: string;
          readonly description: string;
          readonly id: string;
          readonly importance: MitigationImportance;
          readonly name: string;
          readonly state: MitigationState;
          readonly updatedAt: string;
        };
      }>;
    };
  };
};
export type MitigationListViewQuery = {
  response: MitigationListViewQuery$data;
  variables: MitigationListViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "organizationId"
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": {
            "direction": "ASC",
            "field": "CREATED_AT"
          }
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
                  "name": "category",
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
                  "name": "importance",
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
  "type": "Organization",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MitigationListViewQuery",
    "selections": [
      {
        "alias": "organization",
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v4/*: any*/)
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
    "name": "MitigationListViewQuery",
    "selections": [
      {
        "alias": "organization",
        "args": (v2/*: any*/),
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
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "112f47aec28111c799333f3cd144d3c1",
    "id": null,
    "metadata": {},
    "name": "MitigationListViewQuery",
    "operationKind": "query",
    "text": "query MitigationListViewQuery(\n  $organizationId: ID!\n  $first: Int\n) {\n  organization: node(id: $organizationId) {\n    __typename\n    id\n    ... on Organization {\n      mitigations(first: $first, orderBy: {direction: ASC, field: CREATED_AT}) {\n        edges {\n          node {\n            id\n            name\n            description\n            category\n            state\n            importance\n            createdAt\n            updatedAt\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "80e8c9cffc7d63bd3ce97ea90f696e82";

export default node;
