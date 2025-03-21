/**
 * @generated SignedSource<<02beff12353573ba1a8701513b4e9a7e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationLayoutBreadcrumbPolicyOverviewQuery$variables = {
  policyId: string;
};
export type OrganizationLayoutBreadcrumbPolicyOverviewQuery$data = {
  readonly policy: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationLayoutBreadcrumbPolicyOverviewQuery = {
  response: OrganizationLayoutBreadcrumbPolicyOverviewQuery$data;
  variables: OrganizationLayoutBreadcrumbPolicyOverviewQuery$variables;
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
      "name": "name",
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
    "name": "OrganizationLayoutBreadcrumbPolicyOverviewQuery",
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
    "name": "OrganizationLayoutBreadcrumbPolicyOverviewQuery",
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
    "cacheID": "a7bbb574545c752bde0eba468ec494d7",
    "id": null,
    "metadata": {},
    "name": "OrganizationLayoutBreadcrumbPolicyOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationLayoutBreadcrumbPolicyOverviewQuery(\n  $policyId: ID!\n) {\n  policy: node(id: $policyId) {\n    __typename\n    id\n    ... on Policy {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "90b9df71a590d79f4e083aa117ad7302";

export default node;
