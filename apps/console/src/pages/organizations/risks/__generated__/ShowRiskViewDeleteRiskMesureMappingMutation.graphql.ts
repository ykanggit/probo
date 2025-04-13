/**
 * @generated SignedSource<<0fc791ecc00bfd6b1aa3a8da262df36c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskMesureMappingInput = {
  mesureId: string;
  riskId: string;
};
export type ShowRiskViewDeleteRiskMesureMappingMutation$variables = {
  input: DeleteRiskMesureMappingInput;
};
export type ShowRiskViewDeleteRiskMesureMappingMutation$data = {
  readonly deleteRiskMesureMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewDeleteRiskMesureMappingMutation = {
  response: ShowRiskViewDeleteRiskMesureMappingMutation$data;
  variables: ShowRiskViewDeleteRiskMesureMappingMutation$variables;
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
    "concreteType": "DeleteRiskMesureMappingPayload",
    "kind": "LinkedField",
    "name": "deleteRiskMesureMapping",
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
    "name": "ShowRiskViewDeleteRiskMesureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewDeleteRiskMesureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d46920306e833fb33b4f10dca6aa1c5a",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskMesureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskMesureMappingMutation(\n  $input: DeleteRiskMesureMappingInput!\n) {\n  deleteRiskMesureMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "e55c8d6490fbcfe0d287053200b6347d";

export default node;
