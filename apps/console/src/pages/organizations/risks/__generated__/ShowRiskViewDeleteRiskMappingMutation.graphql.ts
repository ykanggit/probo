/**
 * @generated SignedSource<<45a4aca30e16d598cd188f3cbc041a0d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskMappingInput = {
  mitigationId: string;
  riskId: string;
};
export type ShowRiskViewDeleteRiskMappingMutation$variables = {
  input: DeleteRiskMappingInput;
};
export type ShowRiskViewDeleteRiskMappingMutation$data = {
  readonly deleteRiskMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewDeleteRiskMappingMutation = {
  response: ShowRiskViewDeleteRiskMappingMutation$data;
  variables: ShowRiskViewDeleteRiskMappingMutation$variables;
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
    "concreteType": "DeleteRiskMappingPayload",
    "kind": "LinkedField",
    "name": "deleteRiskMapping",
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
    "name": "ShowRiskViewDeleteRiskMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewDeleteRiskMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "847faec465a30f457c57c5c1524a707d",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskMappingMutation(\n  $input: DeleteRiskMappingInput!\n) {\n  deleteRiskMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "41aa62a4185b1e6061bd7e06abbec85d";

export default node;
