/**
 * @generated SignedSource<<c1cd34e6543447b414b10f63225883c2>>
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
export type ControlDeleteMitigationMappingMutation$variables = {
  input: DeleteControlMappingInput;
};
export type ControlDeleteMitigationMappingMutation$data = {
  readonly deleteControlMapping: {
    readonly success: boolean;
  };
};
export type ControlDeleteMitigationMappingMutation = {
  response: ControlDeleteMitigationMappingMutation$data;
  variables: ControlDeleteMitigationMappingMutation$variables;
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
    "name": "ControlDeleteMitigationMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlDeleteMitigationMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "31dcbb70c0b32e78dcb3fd2a2dc1a58b",
    "id": null,
    "metadata": {},
    "name": "ControlDeleteMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeleteMitigationMappingMutation(\n  $input: DeleteControlMappingInput!\n) {\n  deleteControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "6070b58009682dfa712e445363f0ebf5";

export default node;
