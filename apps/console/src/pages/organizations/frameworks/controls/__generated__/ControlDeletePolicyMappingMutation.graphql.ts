/**
 * @generated SignedSource<<16f8815c8b1db694fb8cd18be95c3f53>>
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
    readonly deletedPolicyId: string;
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
        "name": "deletedPolicyId",
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
    "cacheID": "ae87d43859683362f6c7024e7f371425",
    "id": null,
    "metadata": {},
    "name": "ControlDeletePolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeletePolicyMappingMutation(\n  $input: DeleteControlPolicyMappingInput!\n) {\n  deleteControlPolicyMapping(input: $input) {\n    deletedPolicyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "39306cd73fd5af5c603272f0bba45a8f";

export default node;
