/**
 * @generated SignedSource<<b2d5c0102cdcaff05ca490a75b797625>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskMesureMappingInput = {
  mesureId: string;
  riskId: string;
};
export type ShowRiskViewCreateRiskMesureMappingMutation$variables = {
  input: CreateRiskMesureMappingInput;
};
export type ShowRiskViewCreateRiskMesureMappingMutation$data = {
  readonly createRiskMesureMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewCreateRiskMesureMappingMutation = {
  response: ShowRiskViewCreateRiskMesureMappingMutation$data;
  variables: ShowRiskViewCreateRiskMesureMappingMutation$variables;
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
    "concreteType": "CreateRiskMesureMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskMesureMapping",
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
    "name": "ShowRiskViewCreateRiskMesureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskMesureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f7d34307825549877c07678c77ca17c6",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskMesureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskMesureMappingMutation(\n  $input: CreateRiskMesureMappingInput!\n) {\n  createRiskMesureMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "e1d7cdd482d6658c2befddd478a3397d";

export default node;
