/**
 * @generated SignedSource<<87f06a7e4f736af29d5dafddd750eaff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskMeasureMappingInput = {
  measureId: string;
  riskId: string;
};
export type ShowRiskViewCreateRiskMeasureMappingMutation$variables = {
  input: CreateRiskMeasureMappingInput;
};
export type ShowRiskViewCreateRiskMeasureMappingMutation$data = {
  readonly createRiskMeasureMapping: {
    readonly riskEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type ShowRiskViewCreateRiskMeasureMappingMutation = {
  response: ShowRiskViewCreateRiskMeasureMappingMutation$data;
  variables: ShowRiskViewCreateRiskMeasureMappingMutation$variables;
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
    "concreteType": "CreateRiskMeasureMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskMeasureMapping",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RiskEdge",
        "kind": "LinkedField",
        "name": "riskEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Risk",
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
    "name": "ShowRiskViewCreateRiskMeasureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskMeasureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d767dfb986b187e7eaad1e442e9a2822",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskMeasureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskMeasureMappingMutation(\n  $input: CreateRiskMeasureMappingInput!\n) {\n  createRiskMeasureMapping(input: $input) {\n    riskEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "11529c76ce2bb6c0d0b6813c51f3ae9d";

export default node;
