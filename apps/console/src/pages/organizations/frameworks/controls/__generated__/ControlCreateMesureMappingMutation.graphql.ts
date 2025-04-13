/**
 * @generated SignedSource<<aad63785dac93ad7f8db05ee4f219109>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlMesureMappingInput = {
  controlId: string;
  mesureId: string;
};
export type ControlCreateMesureMappingMutation$variables = {
  input: CreateControlMesureMappingInput;
};
export type ControlCreateMesureMappingMutation$data = {
  readonly createControlMesureMapping: {
    readonly success: boolean;
  };
};
export type ControlCreateMesureMappingMutation = {
  response: ControlCreateMesureMappingMutation$data;
  variables: ControlCreateMesureMappingMutation$variables;
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
    "concreteType": "CreateControlMesureMappingPayload",
    "kind": "LinkedField",
    "name": "createControlMesureMapping",
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
    "name": "ControlCreateMesureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreateMesureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "589fad9dec58fb2efe52e8e587c8ce85",
    "id": null,
    "metadata": {},
    "name": "ControlCreateMesureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreateMesureMappingMutation(\n  $input: CreateControlMesureMappingInput!\n) {\n  createControlMesureMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "8974d4f4025f6e1eaba2a6b30e357486";

export default node;
