/**
 * @generated SignedSource<<02b5ad33ae08fb81731cf27c34f31ccf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlMappingInput = {
  controlId: string;
  mitigationId: string;
};
export type ControlViewCreateMitigationMappingMutation$variables = {
  input: CreateControlMappingInput;
};
export type ControlViewCreateMitigationMappingMutation$data = {
  readonly createControlMapping: {
    readonly success: boolean;
  };
};
export type ControlViewCreateMitigationMappingMutation = {
  response: ControlViewCreateMitigationMappingMutation$data;
  variables: ControlViewCreateMitigationMappingMutation$variables;
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
    "concreteType": "CreateControlMappingPayload",
    "kind": "LinkedField",
    "name": "createControlMapping",
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
    "name": "ControlViewCreateMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlViewCreateMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1d95423714868543cd1ae0867f7274f5",
    "id": null,
    "metadata": {},
    "name": "ControlViewCreateMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewCreateMitigationMappingMutation(\n  $input: CreateControlMappingInput!\n) {\n  createControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "caa36b4928fc747295d0b3cb8c90f786";

export default node;
