/**
 * @generated SignedSource<<ca410ce7df7231383e55d134d37916bd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery$variables = {
  policyId: string;
};
export type OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery$data = {
  readonly policy: {
    readonly id: string;
    readonly title?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "policyId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "policyId"
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
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Policy",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery",
    "selections": [
      {
        "alias": "policy",
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
    "name": "OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery",
    "selections": [
      {
        "alias": "policy",
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
    "cacheID": "bc0b04bbe75c94660de230461532773a",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery(\n  $policyId: ID!\n) {\n  policy: node(id: $policyId) {\n    __typename\n    id\n    ... on Policy {\n      title\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ced380d1e6eb1c31ecc5f2dc9096133b";

export default node;
