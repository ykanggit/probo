/**
 * @generated SignedSource<<a8e66e7606187f54d173cddac8bcd316>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbMesureViewQuery$variables = {
  mesureId: string;
};
export type OrganizationBreadcrumbBreadcrumbMesureViewQuery$data = {
  readonly mesure: {
    readonly category?: string;
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbMesureViewQuery = {
  response: OrganizationBreadcrumbBreadcrumbMesureViewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbMesureViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mesureId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "mesureId"
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
  "kind": "InlineFragment",
  "selections": [
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
      "name": "category",
      "storageKey": null
    }
  ],
  "type": "Mesure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbMesureViewQuery",
    "selections": [
      {
        "alias": "mesure",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
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
    "name": "OrganizationBreadcrumbBreadcrumbMesureViewQuery",
    "selections": [
      {
        "alias": "mesure",
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
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f6183e3013438a1cff8e91c6ff80f452",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbMesureViewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbMesureViewQuery(\n  $mesureId: ID!\n) {\n  mesure: node(id: $mesureId) {\n    __typename\n    id\n    ... on Mesure {\n      name\n      category\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "67fd3d426bbfcbe90457c3033dade1b3";

export default node;
