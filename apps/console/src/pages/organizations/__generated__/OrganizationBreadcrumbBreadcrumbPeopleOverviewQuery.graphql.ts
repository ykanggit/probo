/**
 * @generated SignedSource<<e4082102cdacffc65067fc1169e4dc22>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery$variables = {
  peopleId: string;
};
export type OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery$data = {
  readonly people: {
    readonly fullName?: string;
    readonly id: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "peopleId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "peopleId"
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
      "name": "fullName",
      "storageKey": null
    }
  ],
  "type": "People",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery",
    "selections": [
      {
        "alias": "people",
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
    "name": "OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery",
    "selections": [
      {
        "alias": "people",
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
    "cacheID": "8e31b69ca914380fb45a65f6caef4f55",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery(\n  $peopleId: ID!\n) {\n  people: node(id: $peopleId) {\n    __typename\n    id\n    ... on People {\n      fullName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "754df51d74ab4c3be0b83fdc689e5cfc";

export default node;
