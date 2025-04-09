/**
 * @generated SignedSource<<2eea3e72c7001db14095958b3bcd750a>>
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
export type ControlCreateMitigationMappingMutation$variables = {
  input: CreateControlMitigationMappingInput;
};
export type ControlCreateMitigationMappingMutation$data = {
  readonly createControlMitigationMapping: {
    readonly success: boolean;
  };
};
export type ControlCreateMitigationMappingMutation = {
  response: ControlCreateMitigationMappingMutation$data;
  variables: ControlCreateMitigationMappingMutation$variables;
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
    "name": "ControlCreateMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreateMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "955241a049e81cd7faed45d69ce3b145",
    "id": null,
    "metadata": {},
    "name": "ControlCreateMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreateMitigationMappingMutation(\n  $input: CreateControlMitigationMappingInput!\n) {\n  createControlMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "ffbcf187d7f2d3c65a2d1fb5c6a180bb";

export default node;
