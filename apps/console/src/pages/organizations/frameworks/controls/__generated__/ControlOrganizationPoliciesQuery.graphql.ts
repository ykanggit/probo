/**
 * @generated SignedSource<<cfe85b9fdabaf24f9a7f575eca8a6417>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "ACTIVE" | "DRAFT";
export type ControlOrganizationPoliciesQuery$variables = {
  organizationId: string;
};
export type ControlOrganizationPoliciesQuery$data = {
  readonly organization: {
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
export type ControlOrganizationPoliciesQuery = {
  response: ControlOrganizationPoliciesQuery$data;
  variables: ControlOrganizationPoliciesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organizationId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "organizationId"
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
    "name": "ControlOrganizationPoliciesQuery",
    "selections": [
      {
        "alias": "organization",
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
                "name": "__Organization__policies_connection",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
            "type": "Organization",
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
    "name": "ControlOrganizationPoliciesQuery",
    "selections": [
      {
        "alias": "organization",
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
                "key": "Organization__policies",
                "kind": "LinkedHandle",
                "name": "policies"
              }
            ],
            "type": "Organization",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3a3c91f3e18e8a4b66011aa583e262e4",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "organization",
            "policies"
          ]
        }
      ]
    },
    "name": "ControlOrganizationPoliciesQuery",
    "operationKind": "query",
    "text": "query ControlOrganizationPoliciesQuery(\n  $organizationId: ID!\n) {\n  organization: node(id: $organizationId) {\n    __typename\n    id\n    ... on Organization {\n      policies(first: 100) {\n        edges {\n          node {\n            id\n            name\n            content\n            status\n            reviewDate\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4699d729e6df6192efd201047689204";

export default node;
