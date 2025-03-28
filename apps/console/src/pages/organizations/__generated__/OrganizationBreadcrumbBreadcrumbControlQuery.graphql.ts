/**
 * @generated SignedSource<<f8a8d22a1da9cce219c0c3be9293fe47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbControlQuery$variables = {
  controlId: string;
};
export type OrganizationBreadcrumbBreadcrumbControlQuery$data = {
  readonly control: {
    readonly id: string;
    readonly referenceId?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbControlQuery = {
  response: OrganizationBreadcrumbBreadcrumbControlQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbControlQuery$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "referenceId",
      "storageKey": null
    }
  ],
  "type": "Control",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbControlQuery",
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
    "name": "OrganizationBreadcrumbBreadcrumbControlQuery",
    "selections": [
      {
        "alias": "control",
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
    "cacheID": "d46d6f288bc94595c84a4c028ba15f83",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbControlQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbControlQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      referenceId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "dd4a9837ee450c35961ee67d3213c017";

export default node;
