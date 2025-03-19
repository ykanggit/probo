/**
 * @generated SignedSource<<f8b972f4147ecb52da49f44ef9c62df1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type ImportFrameworkInput = {
  file: any;
  organizationId: string;
};
export type FrameworkListPageImportFrameworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportFrameworkInput;
};
export type FrameworkListPageImportFrameworkMutation$data = {
  readonly importFramework: {
    readonly frameworkEdge: {
      readonly node: {
        readonly controls: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly id: string;
              readonly state: ControlState;
            };
          }>;
        };
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly updatedAt: string;
      };
    };
  };
};
export type FrameworkListPageImportFrameworkMutation = {
  response: FrameworkListPageImportFrameworkMutation$data;
  variables: FrameworkListPageImportFrameworkMutation$variables;
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
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
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
        (v3/*: any*/),
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
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 100
            }
          ],
          "concreteType": "ControlConnection",
          "kind": "LinkedField",
          "name": "controls",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ControlEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Control",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v3/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "state",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "controls(first:100)"
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
    "name": "FrameworkListPageImportFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportFrameworkPayload",
        "kind": "LinkedField",
        "name": "importFramework",
        "plural": false,
        "selections": [
          (v4/*: any*/)
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
    "name": "FrameworkListPageImportFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportFrameworkPayload",
        "kind": "LinkedField",
        "name": "importFramework",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
    "cacheID": "946e840d5f7bb3a33e7ee1d0e2180bb5",
    "id": null,
    "metadata": {},
    "name": "FrameworkListPageImportFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkListPageImportFrameworkMutation(\n  $input: ImportFrameworkInput!\n) {\n  importFramework(input: $input) {\n    frameworkEdge {\n      node {\n        id\n        name\n        description\n        controls(first: 100) {\n          edges {\n            node {\n              id\n              state\n            }\n          }\n        }\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "76c55c89cce3718241b2ee63f026197b";

export default node;
