/**
 * @generated SignedSource<<92f143ac22d00fc2373928c607a105fa>>
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ImportFrameworkPayload",
    "kind": "LinkedField",
    "name": "importFramework",
    "plural": false,
    "selections": [
      {
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
              (v1/*: any*/),
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
                          (v1/*: any*/),
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FrameworkListPageImportFrameworkMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FrameworkListPageImportFrameworkMutation",
    "selections": (v2/*: any*/)
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

(node as any).hash = "715a97d6fde9a26f202e8281b9211b1f";

export default node;
