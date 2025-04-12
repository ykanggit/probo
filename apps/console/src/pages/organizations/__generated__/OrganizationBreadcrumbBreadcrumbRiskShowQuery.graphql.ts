/**
 * @generated SignedSource<<6cc6ac4101b94ac06f94f04368fbaa6d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbRiskShowQuery$variables = {
  riskId: string;
};
export type OrganizationBreadcrumbBreadcrumbRiskShowQuery$data = {
  readonly risk: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbRiskShowQuery = {
  response: OrganizationBreadcrumbBreadcrumbRiskShowQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbRiskShowQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "riskId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "riskId"
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
  "type": "Risk",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbRiskShowQuery",
    "selections": [
      {
        "alias": "risk",
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
    "name": "OrganizationBreadcrumbBreadcrumbRiskShowQuery",
    "selections": [
      {
        "alias": "risk",
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
    "cacheID": "eaafff390efc7cb4b97300fa65d98c99",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbRiskShowQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbRiskShowQuery(\n  $riskId: ID!\n) {\n  risk: node(id: $riskId) {\n    __typename\n    id\n    ... on Risk {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3f83f754047443e38a51bd8d2351f81c";

export default node;
