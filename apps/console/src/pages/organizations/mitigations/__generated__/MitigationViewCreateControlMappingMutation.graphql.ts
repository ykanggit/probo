/**
 * @generated SignedSource<<d072ba12f8b6bd81f47e8d2fbe56db9c>>
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
export type MitigationViewCreateControlMappingMutation$variables = {
  input: CreateControlMappingInput;
};
export type MitigationViewCreateControlMappingMutation$data = {
  readonly createControlMapping: {
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
    "cacheID": "79290e466d2aa856113aae8a4e7a0035",
    "id": null,
    "metadata": {},
    "name": "MitigationViewCreateControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewCreateControlMappingMutation(\n  $input: CreateControlMappingInput!\n) {\n  createControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "32a27dc5fdd06c261258e80db3db50fc";

export default node;
