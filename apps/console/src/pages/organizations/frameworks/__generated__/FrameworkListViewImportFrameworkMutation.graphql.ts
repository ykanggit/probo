/**
 * @generated SignedSource<<c1a3bc146c71229f94ea60f820bb43eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ImportFrameworkInput = {
  file: any;
  organizationId: string;
};
export type FrameworkListViewImportFrameworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportFrameworkInput;
};
export type FrameworkListViewImportFrameworkMutation$data = {
  readonly importFramework: {
    readonly frameworkEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly updatedAt: string;
      };
    };
  };
};
export type FrameworkListViewImportFrameworkMutation = {
  response: FrameworkListViewImportFrameworkMutation$data;
  variables: FrameworkListViewImportFrameworkMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "FrameworkEdge",
  "kind": "LinkedField",
  "name": "frameworkEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Framework",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
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
    "name": "FrameworkListViewImportFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportFrameworkPayload",
        "kind": "LinkedField",
        "name": "importFramework",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "FrameworkListViewImportFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportFrameworkPayload",
        "kind": "LinkedField",
        "name": "importFramework",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "frameworkEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0d952e4f9f3e106ea7a30d69f7268385",
    "id": null,
    "metadata": {},
    "name": "FrameworkListViewImportFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkListViewImportFrameworkMutation(\n  $input: ImportFrameworkInput!\n) {\n  importFramework(input: $input) {\n    frameworkEdge {\n      node {\n        id\n        name\n        description\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8be3328101831be07eeea8670d47debd";

export default node;
