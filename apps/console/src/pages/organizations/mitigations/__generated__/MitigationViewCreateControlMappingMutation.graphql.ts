/**
 * @generated SignedSource<<53f255c3852774870c7d294d64e6808d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlMitigationMappingInput = {
  controlId: string;
  mitigationId: string;
};
export type MitigationViewCreateControlMappingMutation$variables = {
  input: CreateControlMitigationMappingInput;
};
export type MitigationViewCreateControlMappingMutation$data = {
  readonly createControlMitigationMapping: {
    readonly success: boolean;
  };
};
export type MitigationViewCreateControlMappingMutation = {
  response: MitigationViewCreateControlMappingMutation$data;
  variables: MitigationViewCreateControlMappingMutation$variables;
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
    "concreteType": "CreateControlMitigationMappingPayload",
    "kind": "LinkedField",
    "name": "createControlMitigationMapping",
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
    "name": "MitigationViewCreateControlMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewCreateControlMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fa46c5cf8b96b70117d12cf985247824",
    "id": null,
    "metadata": {},
    "name": "MitigationViewCreateControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewCreateControlMappingMutation(\n  $input: CreateControlMitigationMappingInput!\n) {\n  createControlMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "af6e4d7933e5c428eec0e97cdf0b73dd";

export default node;
