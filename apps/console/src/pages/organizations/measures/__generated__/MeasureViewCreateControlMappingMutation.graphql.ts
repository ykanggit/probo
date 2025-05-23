/**
 * @generated SignedSource<<b762c4de95c264178aa53ec0db98a973>>
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
export type MeasureViewCreateControlMappingMutation$variables = {
  input: CreateControlMeasureMappingInput;
};
export type MeasureViewCreateControlMappingMutation$data = {
  readonly createControlMeasureMapping: {
    readonly controlEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type MeasureViewCreateControlMappingMutation = {
  response: MeasureViewCreateControlMappingMutation$data;
  variables: MeasureViewCreateControlMappingMutation$variables;
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
    "name": "MeasureViewCreateControlMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MeasureViewCreateControlMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "27359a60a5a935f7d707c11d25c5d656",
    "id": null,
    "metadata": {},
    "name": "MeasureViewCreateControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MeasureViewCreateControlMappingMutation(\n  $input: CreateControlMeasureMappingInput!\n) {\n  createControlMeasureMapping(input: $input) {\n    controlEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8621dd4bf5bdb9d06c1451004493fac9";

export default node;
