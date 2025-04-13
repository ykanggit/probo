/**
 * @generated SignedSource<<f5d09284634ce1975ceff8ce576884c9>>
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
export type MesureViewCreateControlMappingMutation$variables = {
  input: CreateControlMesureMappingInput;
};
export type MesureViewCreateControlMappingMutation$data = {
  readonly createControlMesureMapping: {
    readonly success: boolean;
  };
};
export type MesureViewCreateControlMappingMutation = {
  response: MesureViewCreateControlMappingMutation$data;
  variables: MesureViewCreateControlMappingMutation$variables;
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
    "name": "MesureViewCreateControlMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MesureViewCreateControlMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "78c1205d1a787ee2cc4e1173e3ef463f",
    "id": null,
    "metadata": {},
    "name": "MesureViewCreateControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MesureViewCreateControlMappingMutation(\n  $input: CreateControlMesureMappingInput!\n) {\n  createControlMesureMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "cdbbc7ebd2c99ef1d19bac274af5a147";

export default node;
