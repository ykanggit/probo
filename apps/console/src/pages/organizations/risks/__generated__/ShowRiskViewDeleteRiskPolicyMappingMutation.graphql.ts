/**
 * @generated SignedSource<<d11690667058b0e7d271b815f510c44c>>
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
    readonly success: boolean;
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
    "cacheID": "a3e208ccc9b5c1248450edaec7ef8417",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskPolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskPolicyMappingMutation(\n  $input: DeleteRiskPolicyMappingInput!\n) {\n  deleteRiskPolicyMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "5e6b5677587f3c8bad3cec9d751952e1";

export default node;
