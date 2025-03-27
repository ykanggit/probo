/**
 * @generated SignedSource<<e194a128ba01be3824345ec9386bc7e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationLayoutBreadcrumbMitigationOverviewQuery$variables = {
  mitigationId: string;
};
export type OrganizationLayoutBreadcrumbMitigationOverviewQuery$data = {
  readonly mitigation: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationLayoutBreadcrumbMitigationOverviewQuery = {
  response: OrganizationLayoutBreadcrumbMitigationOverviewQuery$data;
  variables: OrganizationLayoutBreadcrumbMitigationOverviewQuery$variables;
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
    "name": "OrganizationLayoutBreadcrumbMitigationOverviewQuery",
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
    "name": "OrganizationLayoutBreadcrumbMitigationOverviewQuery",
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
    "cacheID": "12d02036b7f66c280ddd621941750d00",
    "id": null,
    "metadata": {},
    "name": "OrganizationLayoutBreadcrumbMitigationOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationLayoutBreadcrumbMitigationOverviewQuery(\n  $mitigationId: ID!\n) {\n  mitigation: node(id: $mitigationId) {\n    __typename\n    id\n    ... on Mitigation {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "cd0a93d3c44467278a33729c4a46b0bf";

export default node;
