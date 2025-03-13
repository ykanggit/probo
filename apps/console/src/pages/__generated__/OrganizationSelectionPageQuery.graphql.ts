/**
 * @generated SignedSource<<d50c4986386f83d9755379cd44eb7c2c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationSelectionPageQuery$variables = Record<PropertyKey, never>;
export type OrganizationSelectionPageQuery$data = {
  readonly viewer: {
    readonly id: string;
    readonly organizations: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly logoUrl: string | null | undefined;
          readonly name: string;
        };
      }>;
    };
  };
};
export type OrganizationSelectionPageQuery = {
  response: OrganizationSelectionPageQuery$data;
  variables: OrganizationSelectionPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 25
          }
        ],
        "concreteType": "OrganizationConnection",
        "kind": "LinkedField",
        "name": "organizations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "OrganizationEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
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
                    "name": "logoUrl",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "organizations(first:25)"
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationSelectionPageQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrganizationSelectionPageQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "634e8f413a8b1f2685cfc1f4fd3c13cc",
    "id": null,
    "metadata": {},
    "name": "OrganizationSelectionPageQuery",
    "operationKind": "query",
    "text": "query OrganizationSelectionPageQuery {\n  viewer {\n    id\n    organizations(first: 25) {\n      edges {\n        node {\n          id\n          name\n          logoUrl\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "786037ac4c8d61f3b7cf6b4536aadbbb";

export default node;
