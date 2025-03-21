/**
 * @generated SignedSource<<ebdda8f7be44df65a5ba836693e48bea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationLayoutBreadcrumbControlOverviewQuery$variables = {
  controlId: string;
};
export type OrganizationLayoutBreadcrumbControlOverviewQuery$data = {
  readonly control: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationLayoutBreadcrumbControlOverviewQuery = {
  response: OrganizationLayoutBreadcrumbControlOverviewQuery$data;
  variables: OrganizationLayoutBreadcrumbControlOverviewQuery$variables;
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
      "name": "name",
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
    "name": "OrganizationLayoutBreadcrumbControlOverviewQuery",
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
    "name": "OrganizationLayoutBreadcrumbControlOverviewQuery",
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
    "cacheID": "2fa16d62f29015853c425704e3de3fd4",
    "id": null,
    "metadata": {},
    "name": "OrganizationLayoutBreadcrumbControlOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationLayoutBreadcrumbControlOverviewQuery(\n  $controlId: ID!\n) {\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "202e114f9b94e9c0bf805b0ae8f69fcd";

export default node;
