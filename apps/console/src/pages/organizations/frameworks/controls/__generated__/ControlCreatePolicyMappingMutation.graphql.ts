/**
 * @generated SignedSource<<d614f25231ff53581f96021c5b52628a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlPolicyMappingInput = {
  controlId: string;
  policyId: string;
};
export type ControlCreatePolicyMappingMutation$variables = {
  input: CreateControlPolicyMappingInput;
};
export type ControlCreatePolicyMappingMutation$data = {
  readonly createControlPolicyMapping: {
    readonly success: boolean;
  };
};
export type ControlCreatePolicyMappingMutation = {
  response: ControlCreatePolicyMappingMutation$data;
  variables: ControlCreatePolicyMappingMutation$variables;
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
    "concreteType": "CreateControlPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "createControlPolicyMapping",
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
    "name": "ControlCreatePolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreatePolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bde220ef49867cec6b77bffc06878258",
    "id": null,
    "metadata": {},
    "name": "ControlCreatePolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreatePolicyMappingMutation(\n  $input: CreateControlPolicyMappingInput!\n) {\n  createControlPolicyMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "8e6ef41146efb59340331e16ce0493d6";

export default node;
