/**
 * @generated SignedSource<<94f5c5a041ae3730b8f4a71ad63530a8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MesureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type ControlLinkedMesuresQuery$variables = {
  controlId: string;
};
export type ControlLinkedMesuresQuery$data = {
  readonly control: {
    readonly id: string;
    readonly mesures?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly category: string;
          readonly description: string;
          readonly id: string;
          readonly name: string;
          readonly state: MesureState;
        };
      }>;
    };
  };
};
export type ControlLinkedMesuresQuery = {
  response: ControlLinkedMesuresQuery$data;
  variables: ControlLinkedMesuresQuery$variables;
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
    "concreteType": "MesureEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Mesure",
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
    "name": "ControlLinkedMesuresQuery",
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
                "alias": "mesures",
                "args": null,
                "concreteType": "MesureConnection",
                "kind": "LinkedField",
                "name": "__Control__mesures_connection",
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
    "name": "ControlLinkedMesuresQuery",
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
                "concreteType": "MesureConnection",
                "kind": "LinkedField",
                "name": "mesures",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "mesures(first:100)"
              },
              {
                "alias": null,
                "args": (v5/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "Control__mesures",
                "kind": "LinkedHandle",
                "name": "mesures"
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
    "cacheID": "b29cb1662103fc42abf16fa6b3458a68",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "control",
            "mesures"
          ]
        }
      ]
    },
    "name": "ControlLinkedMesuresQuery",
    "operationKind": "query",
    "text": "query ControlLinkedMesuresQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      mesures(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            category\n            state\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e42a48d7b21eaa5c42331377b6a9bc9c";

export default node;
