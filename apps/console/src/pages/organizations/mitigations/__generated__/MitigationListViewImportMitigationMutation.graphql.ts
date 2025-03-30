/**
 * @generated SignedSource<<d4590a13a15cf248104340854bc46aa7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type ImportMitigationInput = {
  file: any;
  organizationId: string;
};
export type MitigationListViewImportMitigationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportMitigationInput;
};
export type MitigationListViewImportMitigationMutation$data = {
  readonly importMitigation: {
    readonly mitigationEdges: ReadonlyArray<{
      readonly node: {
        readonly category: string;
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly importance: MitigationImportance;
        readonly name: string;
        readonly state: MitigationState;
        readonly updatedAt: string;
      };
    }>;
  };
};
export type MitigationListViewImportMitigationMutation = {
  response: MitigationListViewImportMitigationMutation$data;
  variables: MitigationListViewImportMitigationMutation$variables;
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
  "concreteType": "MitigationEdge",
  "kind": "LinkedField",
  "name": "mitigationEdges",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Mitigation",
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
          "name": "category",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "state",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "importance",
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
    "name": "MitigationListViewImportMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportMitigationPayload",
        "kind": "LinkedField",
        "name": "importMitigation",
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
    "name": "MitigationListViewImportMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "ImportMitigationPayload",
        "kind": "LinkedField",
        "name": "importMitigation",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "mitigationEdges",
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
    "cacheID": "84c038c572378999bfaacb87e8172b1e",
    "id": null,
    "metadata": {},
    "name": "MitigationListViewImportMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationListViewImportMitigationMutation(\n  $input: ImportMitigationInput!\n) {\n  importMitigation(input: $input) {\n    mitigationEdges {\n      node {\n        id\n        name\n        description\n        category\n        state\n        importance\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "59e3d4a8e71cee0dcee606b93d706dad";

export default node;
