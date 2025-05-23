/**
 * @generated SignedSource<<8f8d550cd2bbc73744ba0b7a97720a49>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskPolicyMappingInput = {
  policyId: string;
  riskId: string;
};
export type ShowRiskViewDeleteRiskPolicyMappingMutation$variables = {
  input: DeleteRiskPolicyMappingInput;
};
export type ShowRiskViewDeleteRiskPolicyMappingMutation$data = {
  readonly deleteRiskPolicyMapping: {
    readonly deletedPolicyId: string;
  };
};
export type ShowRiskViewDeleteRiskPolicyMappingMutation = {
  response: ShowRiskViewDeleteRiskPolicyMappingMutation$data;
  variables: ShowRiskViewDeleteRiskPolicyMappingMutation$variables;
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
    "concreteType": "DeleteRiskPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "deleteRiskPolicyMapping",
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
    "name": "ShowRiskViewDeleteRiskPolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewDeleteRiskPolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d10c9ccbc01259fb7fea2bf463d6ecc6",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskPolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskPolicyMappingMutation(\n  $input: DeleteRiskPolicyMappingInput!\n) {\n  deleteRiskPolicyMapping(input: $input) {\n    deletedPolicyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "26177c99b1c35723f913637a1d6ac54b";

export default node;
