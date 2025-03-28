/**
 * @generated SignedSource<<5ba3e58b066b4fb849ab455b287dc1ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery$variables = {
  mitigationId: string;
};
export type OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery$data = {
  readonly mitigation: {
    readonly id: string;
    readonly name?: string;
  };
};
export type OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery = {
  response: OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery$data;
  variables: OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery$variables;
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
    "name": "OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery",
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
    "name": "OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery",
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
    "cacheID": "1f6462cdfacf6a2ce5bf51135d26daf3",
    "id": null,
    "metadata": {},
    "name": "OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery",
    "operationKind": "query",
    "text": "query OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery(\n  $mitigationId: ID!\n) {\n  mitigation: node(id: $mitigationId) {\n    __typename\n    id\n    ... on Mitigation {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "83c2699bc436040d610f5113cc267e7f";

export default node;
