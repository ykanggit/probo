/**
 * @generated SignedSource<<97db419e0a721e3a40619b1dbe4f9cde>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlMeasureMappingInput = {
  controlId: string;
  measureId: string;
};
export type ControlCreateMeasureMappingMutation$variables = {
  input: CreateControlMeasureMappingInput;
};
export type ControlCreateMeasureMappingMutation$data = {
  readonly createControlMeasureMapping: {
    readonly controlEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type ControlCreateMeasureMappingMutation = {
  response: ControlCreateMeasureMappingMutation$data;
  variables: ControlCreateMeasureMappingMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateControlMeasureMappingPayload",
    "kind": "LinkedField",
    "name": "createControlMeasureMapping",
    "plural": false,
    "selections": [
      {
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
    "name": "ControlCreateMeasureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreateMeasureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "47a25e6c0c8c8695cf742b3cb5dfc90e",
    "id": null,
    "metadata": {},
    "name": "ControlCreateMeasureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreateMeasureMappingMutation(\n  $input: CreateControlMeasureMappingInput!\n) {\n  createControlMeasureMapping(input: $input) {\n    controlEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4d5a5c705066af948f689da7e1ae491e";

export default node;
