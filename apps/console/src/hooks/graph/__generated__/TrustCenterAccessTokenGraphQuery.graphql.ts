/**
 * @generated SignedSource<<6e43a07222fde7acc3d588bac24a8077>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TrustCenterAccessTokenGraphQuery$variables = {
  trustCenterId: string;
};
export type TrustCenterAccessTokenGraphQuery$data = {
  readonly node: {
    readonly active?: boolean;
    readonly id?: string;
    readonly organization?: {
      readonly id: string;
      readonly name: string;
    };
    readonly slug?: string;
  };
};
export type TrustCenterAccessTokenGraphQuery = {
  response: TrustCenterAccessTokenGraphQuery$data;
  variables: TrustCenterAccessTokenGraphQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "trustCenterId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "trustCenterId"
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
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "active",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Organization",
  "kind": "LinkedField",
  "name": "organization",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TrustCenterAccessTokenGraphQuery",
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
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "TrustCenter",
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
    "name": "TrustCenterAccessTokenGraphQuery",
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/)
            ],
            "type": "TrustCenter",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7d3d891944391d31a722364f8b1f1cbb",
    "id": null,
    "metadata": {},
    "name": "TrustCenterAccessTokenGraphQuery",
    "operationKind": "query",
    "text": "query TrustCenterAccessTokenGraphQuery(\n  $trustCenterId: ID!\n) {\n  node(id: $trustCenterId) {\n    __typename\n    ... on TrustCenter {\n      id\n      slug\n      active\n      organization {\n        id\n        name\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e273d4e8c8b756a5aba5271520df8602";

export default node;
