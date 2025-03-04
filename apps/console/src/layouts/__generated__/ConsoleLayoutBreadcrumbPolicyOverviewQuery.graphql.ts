/**
 * @generated SignedSource<<03812f2d66d34ef3636bc7890059f4cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbPolicyOverviewQuery$variables = {
  policyId: string;
};
export type ConsoleLayoutBreadcrumbPolicyOverviewQuery$data = {
  readonly policy: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbPolicyOverviewQuery = {
  response: ConsoleLayoutBreadcrumbPolicyOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbPolicyOverviewQuery$variables;
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
    "name": "ConsoleLayoutBreadcrumbPolicyOverviewQuery",
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
    "name": "ConsoleLayoutBreadcrumbPolicyOverviewQuery",
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
    "cacheID": "2c38760f04efaf9b41d6b2abb17c2074",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbPolicyOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbPolicyOverviewQuery(\n  $policyId: ID!\n) {\n  policy: node(id: $policyId) {\n    __typename\n    id\n    ... on Policy {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f2a356a6aa9b98ca13dde3b82e2e868a";

export default node;
