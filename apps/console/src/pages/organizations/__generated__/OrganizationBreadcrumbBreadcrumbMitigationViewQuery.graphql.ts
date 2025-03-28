/**
 * @generated SignedSource<<5297fe6c58e18534c0e9684cfea6b319>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbMitigationViewQuery$variables = {
  mitigationId: string;
};
export type OrganizationBreadcrumbBreadcrumbMitigationViewQuery$data = {
  readonly mitigation: {
    readonly category?: string;
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbMitigationViewQuery = {
  response: OrganizationBreadcrumbBreadcrumbMitigationViewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbMitigationViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mitigationId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "mitigationId"
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
  "type": "Mitigation",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbMitigationViewQuery",
    "selections": [
      {
        "alias": "mitigation",
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
    "name": "OrganizationBreadcrumbBreadcrumbMitigationViewQuery",
    "selections": [
      {
        "alias": "mitigation",
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
    "cacheID": "dcc05f69cfc1d38fae2488aa4740f109",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbMitigationViewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbMitigationViewQuery(\n  $mitigationId: ID!\n) {\n  mitigation: node(id: $mitigationId) {\n    __typename\n    id\n    ... on Mitigation {\n      name\n      category\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0b8d38ad84bd4c5a684711285c29e5a4";

export default node;
