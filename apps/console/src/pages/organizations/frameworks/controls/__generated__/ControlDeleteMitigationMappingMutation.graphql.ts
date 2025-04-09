/**
 * @generated SignedSource<<7c4ad77e70fa42cf8257113897a607ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteControlMitigationMappingInput = {
  controlId: string;
  mitigationId: string;
};
export type ControlDeleteMitigationMappingMutation$variables = {
  input: DeleteControlMitigationMappingInput;
};
export type ControlDeleteMitigationMappingMutation$data = {
  readonly deleteControlMitigationMapping: {
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
    "concreteType": "DeleteControlMitigationMappingPayload",
    "kind": "LinkedField",
    "name": "deleteControlMitigationMapping",
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
    "cacheID": "3d09a29c8ae06a97d098e565a7f2d172",
    "id": null,
    "metadata": {},
    "name": "ControlDeleteMitigationMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeleteMitigationMappingMutation(\n  $input: DeleteControlMitigationMappingInput!\n) {\n  deleteControlMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "6905236aeeb313e5deed3e569a0c7c54";

export default node;
