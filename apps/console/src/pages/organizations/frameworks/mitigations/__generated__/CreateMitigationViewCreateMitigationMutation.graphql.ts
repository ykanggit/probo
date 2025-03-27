/**
 * @generated SignedSource<<07454812ea72dd51d0b615737e75a2a1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type CreateMitigationInput = {
  category: string;
  description: string;
  importance: MitigationImportance;
  name: string;
  organizationId: string;
};
export type CreateMitigationViewCreateMitigationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateMitigationInput;
};
export type CreateMitigationViewCreateMitigationMutation$data = {
  readonly createMitigation: {
    readonly mitigationEdge: {
      readonly node: {
        readonly category: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly state: MitigationState;
      };
    };
  };
};
export type CreateMitigationViewCreateMitigationMutation = {
  response: CreateMitigationViewCreateMitigationMutation$data;
  variables: CreateMitigationViewCreateMitigationMutation$variables;
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
    "name": "CreateMitigationViewCreateMitigationMutation",
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
    "name": "CreateMitigationViewCreateMitigationMutation",
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
    "cacheID": "09c15768681bc81e7035ff20e90e81a0",
    "id": null,
    "metadata": {},
    "name": "CreateMitigationViewCreateMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation CreateMitigationViewCreateMitigationMutation(\n  $input: CreateMitigationInput!\n) {\n  createMitigation(input: $input) {\n    mitigationEdge {\n      node {\n        id\n        name\n        description\n        category\n        state\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "42db1acd8c6e92678c9e6355a77e1eb6";

export default node;
