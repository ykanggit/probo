/**
 * @generated SignedSource<<bfb82e1523f2352b45b1cf3135a05b19>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type VendorListPageQuery$variables = {
  after?: any | null | undefined;
  before?: any | null | undefined;
  count: number;
};
export type VendorListPageQuery$data = {
  readonly node: {
    readonly id: string;
    readonly vendors?: {
      readonly edges: ReadonlyArray<{
        readonly cursor: any;
        readonly node: {
          readonly createdAt: any;
          readonly id: string;
          readonly name: string;
          readonly updatedAt: any;
        };
      }>;
      readonly pageInfo: {
        readonly endCursor: any | null | undefined;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
        readonly startCursor: any | null | undefined;
      };
    };
  };
};
export type VendorListPageQuery = {
  response: VendorListPageQuery$data;
  variables: VendorListPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v3 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "AZSfP_xAcAC5IAAAAAAltA"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "after",
          "variableName": "after"
        },
        {
          "kind": "Variable",
          "name": "before",
          "variableName": "before"
        },
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "count"
        }
      ],
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
                (v4/*: any*/),
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorListPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "VendorListPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ]
  },
  "params": {
    "cacheID": "813b95f0cae45fec89ee444ce9be7ebb",
    "id": null,
    "metadata": {},
    "name": "VendorListPageQuery",
    "operationKind": "query",
    "text": "query VendorListPageQuery(\n  $count: Int!\n  $after: CursorKey\n  $before: CursorKey\n) {\n  node(id: \"AZSfP_xAcAC5IAAAAAAltA\") {\n    __typename\n    id\n    ... on Organization {\n      vendors(first: $count, after: $after, before: $before) {\n        edges {\n          node {\n            id\n            name\n            createdAt\n            updatedAt\n          }\n          cursor\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "46f94dbcc31c870cab30e1b8a2c64095";

export default node;
