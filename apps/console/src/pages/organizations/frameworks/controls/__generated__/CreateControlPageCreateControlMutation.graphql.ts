/**
 * @generated SignedSource<<6a4f7190379c0f273e97cedf6aebe517>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type ControlState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type CreateControlInput = {
  category: string;
  description: string;
  frameworkId: string;
  importance: ControlImportance;
  name: string;
};
export type CreateControlPageCreateControlMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateControlInput;
};
export type CreateControlPageCreateControlMutation$data = {
  readonly createControl: {
    readonly controlEdge: {
      readonly node: {
        readonly category: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly state: ControlState;
      };
    };
  };
};
export type CreateControlPageCreateControlMutation = {
  response: CreateControlPageCreateControlMutation$data;
  variables: CreateControlPageCreateControlMutation$variables;
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
  "concreteType": "ControlEdge",
  "kind": "LinkedField",
  "name": "controlEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Control",
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
    "name": "CreateControlPageCreateControlMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateControlPayload",
        "kind": "LinkedField",
        "name": "createControl",
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
    "name": "CreateControlPageCreateControlMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateControlPayload",
        "kind": "LinkedField",
        "name": "createControl",
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
            "name": "controlEdge",
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
    "cacheID": "c6b6a979bccf19dd57123c49d5ce738b",
    "id": null,
    "metadata": {},
    "name": "CreateControlPageCreateControlMutation",
    "operationKind": "mutation",
    "text": "mutation CreateControlPageCreateControlMutation(\n  $input: CreateControlInput!\n) {\n  createControl(input: $input) {\n    controlEdge {\n      node {\n        id\n        name\n        description\n        category\n        state\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f8f339056a2f83c78ce3a642fa6ecc6";

export default node;
