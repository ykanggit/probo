/**
 * @generated SignedSource<<406a706e512ed01c1924632306a4f81c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskMitigationMappingInput = {
  mitigationId: string;
  riskId: string;
};
export type ShowRiskViewDeleteRiskMitigationMappingMutation$variables = {
  input: DeleteRiskMitigationMappingInput;
};
export type ShowRiskViewDeleteRiskMitigationMappingMutation$data = {
  readonly deleteRiskMitigationMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewDeleteRiskMitigationMappingMutation = {
  response: ShowRiskViewDeleteRiskMitigationMappingMutation$data;
  variables: ShowRiskViewDeleteRiskMitigationMappingMutation$variables;
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
    "concreteType": "DeleteRiskMitigationMappingPayload",
    "kind": "LinkedField",
    "name": "deleteRiskMitigationMapping",
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
    "name": "ShowRiskViewDeleteRiskMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewDeleteRiskMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9a4b56b457c7fb53dc2583da93a3aaa4",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskMitigationMappingMutation(\n  $input: DeleteRiskMitigationMappingInput!\n) {\n  deleteRiskMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "d9fece39ecffbd551662d6491088ce4c";

export default node;
