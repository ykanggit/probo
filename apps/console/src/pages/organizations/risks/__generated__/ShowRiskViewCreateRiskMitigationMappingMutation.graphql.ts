/**
 * @generated SignedSource<<73623cc6511c56dd418345cd64d500d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskMitigationMappingInput = {
  mitigationId: string;
  riskId: string;
};
export type ShowRiskViewCreateRiskMitigationMappingMutation$variables = {
  input: CreateRiskMitigationMappingInput;
};
export type ShowRiskViewCreateRiskMitigationMappingMutation$data = {
  readonly createRiskMitigationMapping: {
    readonly success: boolean;
  };
};
export type ShowRiskViewCreateRiskMitigationMappingMutation = {
  response: ShowRiskViewCreateRiskMitigationMappingMutation$data;
  variables: ShowRiskViewCreateRiskMitigationMappingMutation$variables;
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
    "concreteType": "CreateRiskMitigationMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskMitigationMapping",
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
    "name": "ShowRiskViewCreateRiskMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5a8744dfb9cf5f977c2702d848aab7ae",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskMitigationMappingMutation(\n  $input: CreateRiskMitigationMappingInput!\n) {\n  createRiskMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "bdb664dab4a9e655c0923cfdd4ab0fe9";

export default node;
