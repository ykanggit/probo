/**
 * @generated SignedSource<<16f4621b72343a04c88df9d0b137c9fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskMappingInput = {
  impact: number;
  mitigationId: string;
  probability: number;
  riskId: string;
};
export type ShowRiskViewCreateRiskMappingMutation$variables = {
  input: CreateRiskMappingInput;
};
export type ShowRiskViewCreateRiskMappingMutation$data = {
  readonly createRiskMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewCreateRiskMappingMutation = {
  response: ShowRiskViewCreateRiskMappingMutation$data;
  variables: ShowRiskViewCreateRiskMappingMutation$variables;
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
    "concreteType": "CreateRiskMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskMapping",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "ShowRiskViewCreateRiskMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "32dfd9049a8c6c1d404528bac1316346",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskMappingMutation(\n  $input: CreateRiskMappingInput!\n) {\n  createRiskMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "02f82b14cc6cf7c2e39dad4613e9d191";

export default node;
