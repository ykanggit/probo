/**
 * @generated SignedSource<<9bddb18bf52f14881a85995793bdc1ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "ACTIVE" | "DRAFT";
export type ControlLinkedPoliciesQuery$variables = {
  controlId: string;
};
export type ControlLinkedPoliciesQuery$data = {
  readonly control: {
    readonly id: string;
    readonly policies?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly content: string;
          readonly id: string;
          readonly name: string;
          readonly reviewDate: string | null | undefined;
          readonly status: PolicyStatus;
        };
      }>;
    };
  };
};
export type ControlLinkedPoliciesQuery = {
  response: ControlLinkedPoliciesQuery$data;
  variables: ControlLinkedPoliciesQuery$variables;
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
  "name": "__typename",
  "storageKey": null
},
v4 = [
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
            "name": "content",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "reviewDate",
            "storageKey": null
          },
          (v3/*: any*/)
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
v5 = [
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
    "name": "ControlLinkedPoliciesQuery",
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
              {
                "alias": "policies",
                "args": null,
                "concreteType": "PolicyConnection",
                "kind": "LinkedField",
                "name": "__Control__policies_connection",
                "plural": false,
                "selections": (v4/*: any*/),
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
    "name": "ControlLinkedPoliciesQuery",
    "selections": [
      {
        "alias": "control",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v5/*: any*/),
                "concreteType": "PolicyConnection",
                "kind": "LinkedField",
                "name": "policies",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "policies(first:100)"
              },
              {
                "alias": null,
                "args": (v5/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Control__policies",
                "kind": "LinkedHandle",
                "name": "policies"
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
    "cacheID": "67f9bf1d5f255f5406e932abde540e08",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "control",
            "policies"
          ]
        }
      ]
    },
    "name": "ControlLinkedPoliciesQuery",
    "operationKind": "query",
    "text": "query ControlLinkedPoliciesQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      policies(first: 100) {\n        edges {\n          node {\n            id\n            name\n            content\n            status\n            reviewDate\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3904c2344754177177fa7c16129dc894";

export default node;
