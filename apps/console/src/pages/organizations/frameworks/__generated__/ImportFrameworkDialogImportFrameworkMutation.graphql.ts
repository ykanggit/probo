/**
 * @generated SignedSource<<2b831625a3ae5e59ef58f138f56c9bda>>
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
export type ImportFrameworkDialogImportFrameworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportFrameworkInput;
};
export type ImportFrameworkDialogImportFrameworkMutation$data = {
  readonly importFramework: {
    readonly frameworkEdge: {
      readonly node: {
        readonly id: string;
        readonly name: string;
      };
    };
  };
};
export type ImportFrameworkDialogImportFrameworkMutation = {
  response: ImportFrameworkDialogImportFrameworkMutation$data;
  variables: ImportFrameworkDialogImportFrameworkMutation$variables;
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
    "name": "ImportFrameworkDialogImportFrameworkMutation",
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
    "name": "ImportFrameworkDialogImportFrameworkMutation",
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
    "cacheID": "3ff0540d8fa361dfc521ef8267c3d853",
    "id": null,
    "metadata": {},
    "name": "ImportFrameworkDialogImportFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation ImportFrameworkDialogImportFrameworkMutation(\n  $input: ImportFrameworkInput!\n) {\n  importFramework(input: $input) {\n    frameworkEdge {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "14ca8dd8ef307731893baaf35eaaba65";

export default node;
