/**
 * @generated SignedSource<<5988b98a6e2ae42a565e51fc13fa5c91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteControlPolicyMappingInput = {
  controlId: string;
  policyId: string;
};
export type ControlDeletePolicyMappingMutation$variables = {
  input: DeleteControlPolicyMappingInput;
};
export type ControlDeletePolicyMappingMutation$data = {
  readonly deleteControlPolicyMapping: {
    readonly success: boolean;
  };
};
export type ControlDeletePolicyMappingMutation = {
  response: ControlDeletePolicyMappingMutation$data;
  variables: ControlDeletePolicyMappingMutation$variables;
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
    "concreteType": "DeleteControlPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "deleteControlPolicyMapping",
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
    "name": "ControlDeletePolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlDeletePolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3b84cd899eee67303695eae81d1ba453",
    "id": null,
    "metadata": {},
    "name": "ControlDeletePolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeletePolicyMappingMutation(\n  $input: DeleteControlPolicyMappingInput!\n) {\n  deleteControlPolicyMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "e706f52dac09ef3fcadeb588ccd0274d";

export default node;
