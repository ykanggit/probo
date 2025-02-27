/**
 * @generated SignedSource<<6f707328d181f9b362855a7b6023acc0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type FrameworkOverviewPageQuery$variables = {
  frameworkId: string;
};
export type FrameworkOverviewPageQuery$data = {
  readonly node: {
    readonly controls?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string;
          readonly description: string;
          readonly id: string;
          readonly name: string;
          readonly state: ControlState;
        };
      }>;
    };
    readonly description?: string;
    readonly id: string;
    readonly name?: string;
  };
};
export type FrameworkOverviewPageQuery = {
  response: FrameworkOverviewPageQuery$data;
  variables: FrameworkOverviewPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "frameworkId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "frameworkId"
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
  "name": "__typename",
  "storageKey": null
},
v6 = [
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
          (v3/*: any*/),
          (v4/*: any*/),
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
            "name": "category",
            "storageKey": null
          },
          (v5/*: any*/)
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
v7 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 90
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FrameworkOverviewPageQuery",
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
              {
                "alias": "controls",
                "args": null,
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "__FrameworkOverviewPage_controls_connection",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              }
            ],
            "type": "Framework",
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
    "name": "FrameworkOverviewPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": (v7/*: any*/),
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "controls",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": "controls(first:90)"
              },
              {
                "alias": null,
                "args": (v7/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "FrameworkOverviewPage_controls",
                "kind": "LinkedHandle",
                "name": "controls"
              }
            ],
            "type": "Framework",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "77f347f74c922dbf3c1dd0baf0e37efd",
    "id": null,
    "metadata": {
      "connection": [
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
    "name": "FrameworkOverviewPageQuery",
    "operationKind": "query",
    "text": "query FrameworkOverviewPageQuery(\n  $frameworkId: ID!\n) {\n  node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n      description\n      controls(first: 90) {\n        edges {\n          node {\n            id\n            name\n            description\n            state\n            category\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "de913888fcb5a475baf829a5773326a3";

export default node;
