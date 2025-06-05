/**
 * @generated SignedSource<<bb6bbcf9a7c38fa57a96bd1652782ccf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbDataOverviewQuery$variables = {
  datumId: string;
};
export type OrganizationBreadcrumbBreadcrumbDataOverviewQuery$data = {
  readonly datum: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbDataOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbDataOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbDataOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "datumId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "datumId"
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
  "type": "Datum",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbDataOverviewQuery",
    "selections": [
      {
        "alias": "datum",
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
    "name": "OrganizationBreadcrumbBreadcrumbDataOverviewQuery",
    "selections": [
      {
        "alias": "datum",
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
    "cacheID": "def453349ef7d9e50a0c22ae89809a1d",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbDataOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbDataOverviewQuery(\n  $datumId: ID!\n) {\n  datum: node(id: $datumId) {\n    __typename\n    id\n    ... on Datum {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1e0885f1072995735ebaa637b59f3325";

export default node;
