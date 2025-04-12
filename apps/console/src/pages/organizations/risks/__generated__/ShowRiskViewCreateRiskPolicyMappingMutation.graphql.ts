/**
 * @generated SignedSource<<0ecdbc802635f485dd265dac34b04386>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskPolicyMappingInput = {
  policyId: string;
  riskId: string;
};
export type ShowRiskViewCreateRiskPolicyMappingMutation$variables = {
  input: CreateRiskPolicyMappingInput;
};
export type ShowRiskViewCreateRiskPolicyMappingMutation$data = {
  readonly createRiskPolicyMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewCreateRiskPolicyMappingMutation = {
  response: ShowRiskViewCreateRiskPolicyMappingMutation$data;
  variables: ShowRiskViewCreateRiskPolicyMappingMutation$variables;
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
    "concreteType": "CreateRiskPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskPolicyMapping",
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
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7aac9b6766d79dcc4785f72b6f6805a8",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskPolicyMappingMutation(\n  $input: CreateRiskPolicyMappingInput!\n) {\n  createRiskPolicyMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "5a10339ed779d863662406775e38ea7b";

export default node;
