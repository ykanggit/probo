/**
 * @generated SignedSource<<c4c2d951d675bc0a763fcf90b6a9a959>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteControlMappingInput = {
  controlId: string;
  mitigationId: string;
};
export type ControlViewDeleteMitigationMappingMutation$variables = {
  input: DeleteControlMappingInput;
};
export type ControlViewDeleteMitigationMappingMutation$data = {
  readonly deleteControlMapping: {
    readonly success: boolean;
  };
};
export type ControlViewDeleteMitigationMappingMutation = {
  response: ControlViewDeleteMitigationMappingMutation$data;
  variables: ControlViewDeleteMitigationMappingMutation$variables;
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
    "concreteType": "DeleteControlMappingPayload",
    "kind": "LinkedField",
    "name": "deleteControlMapping",
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
    "name": "ControlViewDeleteMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlViewDeleteMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "49d66f6dddce3b6c7a82334e36d9b464",
    "id": null,
    "metadata": {},
    "name": "ControlViewDeleteMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewDeleteMitigationMappingMutation(\n  $input: DeleteControlMappingInput!\n) {\n  deleteControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "6f954d3c3c2b38b68a0be5f51de3b935";

export default node;
