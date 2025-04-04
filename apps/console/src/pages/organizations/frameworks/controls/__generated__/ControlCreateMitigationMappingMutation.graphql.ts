/**
 * @generated SignedSource<<7598a6cf0314f71bab809d65acc60237>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlMappingInput = {
  controlId: string;
  mitigationId: string;
};
export type ControlCreateMitigationMappingMutation$variables = {
  input: CreateControlMappingInput;
};
export type ControlCreateMitigationMappingMutation$data = {
  readonly createControlMapping: {
    readonly success: boolean;
  };
};
export type ControlCreateMitigationMappingMutation = {
  response: ControlCreateMitigationMappingMutation$data;
  variables: ControlCreateMitigationMappingMutation$variables;
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
    "concreteType": "CreateControlMappingPayload",
    "kind": "LinkedField",
    "name": "createControlMapping",
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
    "name": "ControlCreateMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreateMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "57ab0bf99dd6ed3d2e980c51f185b9c0",
    "id": null,
    "metadata": {},
    "name": "ControlCreateMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreateMitigationMappingMutation(\n  $input: CreateControlMappingInput!\n) {\n  createControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "17ef8f09acabf19168dad896e4225e3d";

export default node;
