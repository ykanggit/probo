/**
 * @generated SignedSource<<97872b5e7ae5639cfd1270f64bba56ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConsoleLayoutBreadcrumbControlOverviewQuery$variables = {
  controlId: string;
  frameworkId: string;
};
export type ConsoleLayoutBreadcrumbControlOverviewQuery$data = {
  readonly control: {
    readonly id: string;
    readonly name?: string;
  };
  readonly framework: {
    readonly id: string;
    readonly name?: string;
  };
};
export type ConsoleLayoutBreadcrumbControlOverviewQuery = {
  response: ConsoleLayoutBreadcrumbControlOverviewQuery$data;
  variables: ConsoleLayoutBreadcrumbControlOverviewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "controlId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "frameworkId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "frameworkId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v5 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "Framework",
  "abstractKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "controlId"
  }
],
v7 = {
  "kind": "InlineFragment",
  "selections": (v4/*: any*/),
  "type": "Control",
  "abstractKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
    "selections": [
      {
        "alias": "framework",
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "control",
        "args": (v6/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
    "selections": [
      {
        "alias": "framework",
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v8/*: any*/),
          (v3/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "control",
        "args": (v6/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v8/*: any*/),
          (v3/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "11b09324c7d417f8a7a655024c8f74a0",
    "id": null,
    "metadata": {},
    "name": "ConsoleLayoutBreadcrumbControlOverviewQuery",
    "operationKind": "query",
    "text": "query ConsoleLayoutBreadcrumbControlOverviewQuery(\n  $frameworkId: ID!\n  $controlId: ID!\n) {\n  framework: node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n    }\n  }\n  control: node(id: $controlId) {\n    __typename\n    id\n    ... on Control {\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0f7464f6a2432b3820b89e40b55c8545";

export default node;
