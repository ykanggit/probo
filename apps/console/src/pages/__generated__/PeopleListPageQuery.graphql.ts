/**
 * @generated SignedSource<<2ba907db688f627158201c0998785612>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PeopleListPageQuery$variables = Record<PropertyKey, never>;
export type PeopleListPageQuery$data = {
  readonly node: {
    readonly id: string;
    readonly peoples?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly additionalEmailAddresses: ReadonlyArray<string>;
          readonly createdAt: any;
          readonly fullName: string;
          readonly id: string;
          readonly primaryEmailAddress: string;
          readonly updatedAt: any;
        };
      }>;
    };
  };
};
export type PeopleListPageQuery = {
  response: PeopleListPageQuery$data;
  variables: PeopleListPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "AZSfP_xAcAC5IAAAAAAltA"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PeopleConnection",
      "kind": "LinkedField",
      "name": "peoples",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "PeopleEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "People",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "fullName",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "primaryEmailAddress",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "additionalEmailAddresses",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleListPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PeopleListPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": "node(id:\"AZSfP_xAcAC5IAAAAAAltA\")"
      }
    ]
  },
  "params": {
    "cacheID": "ce78c7ac266c38015ae2d44366f19579",
    "id": null,
    "metadata": {},
    "name": "PeopleListPageQuery",
    "operationKind": "query",
    "text": "query PeopleListPageQuery {\n  node(id: \"AZSfP_xAcAC5IAAAAAAltA\") {\n    __typename\n    id\n    ... on Organization {\n      peoples {\n        edges {\n          node {\n            id\n            fullName\n            primaryEmailAddress\n            additionalEmailAddresses\n            createdAt\n            updatedAt\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3892026d3bf2753f6d1ff00ddf0526c";

export default node;
