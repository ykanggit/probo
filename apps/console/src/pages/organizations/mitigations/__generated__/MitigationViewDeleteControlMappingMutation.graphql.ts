/**
 * @generated SignedSource<<aee67baf82965259c299a4ae9947bda3>>
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
export type MitigationViewDeleteControlMappingMutation$variables = {
  input: DeleteControlMappingInput;
};
export type MitigationViewDeleteControlMappingMutation$data = {
  readonly deleteControlMapping: {
    readonly success: boolean;
  };
};
export type MitigationViewDeleteControlMappingMutation = {
  response: MitigationViewDeleteControlMappingMutation$data;
  variables: MitigationViewDeleteControlMappingMutation$variables;
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
    "name": "MitigationViewDeleteControlMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MitigationViewDeleteControlMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "824394c9cc09d7d428ad42835d3737ef",
    "id": null,
    "metadata": {},
    "name": "MitigationViewDeleteControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewDeleteControlMappingMutation(\n  $input: DeleteControlMappingInput!\n) {\n  deleteControlMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "4d7bd098ed16e825abec0e5d996b06e9";

export default node;
