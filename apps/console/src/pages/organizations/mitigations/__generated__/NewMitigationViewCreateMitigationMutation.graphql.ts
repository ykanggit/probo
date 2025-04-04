/**
 * @generated SignedSource<<50b15dea665515ca83a54c39e03453c2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type CreateMitigationInput = {
  category: string;
  description: string;
  importance: MitigationImportance;
  name: string;
  organizationId: string;
};
export type NewMitigationViewCreateMitigationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateMitigationInput;
};
export type NewMitigationViewCreateMitigationMutation$data = {
  readonly createMitigation: {
    readonly mitigationEdge: {
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly name: string;
      };
    };
  };
};
export type NewMitigationViewCreateMitigationMutation = {
  response: NewMitigationViewCreateMitigationMutation$data;
  variables: NewMitigationViewCreateMitigationMutation$variables;
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
  "name": "mitigationEdge",
  "plural": false,
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
    "name": "NewMitigationViewCreateMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMitigationPayload",
        "kind": "LinkedField",
        "name": "createMitigation",
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
    "name": "NewMitigationViewCreateMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMitigationPayload",
        "kind": "LinkedField",
        "name": "createMitigation",
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
            "name": "mitigationEdge",
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
    "cacheID": "9615313ab1f2555f58a79b85741684f4",
    "id": null,
    "metadata": {},
    "name": "NewMitigationViewCreateMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation NewMitigationViewCreateMitigationMutation(\n  $input: CreateMitigationInput!\n) {\n  createMitigation(input: $input) {\n    mitigationEdge {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6b6ead3a24d113ec969c98680956ebb9";

export default node;
