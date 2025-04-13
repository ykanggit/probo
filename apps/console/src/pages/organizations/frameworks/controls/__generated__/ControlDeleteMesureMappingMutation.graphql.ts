/**
 * @generated SignedSource<<272b7b4a8bc0c81baa4a8d8f3656be0c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteControlMesureMappingInput = {
  controlId: string;
  mesureId: string;
};
export type ControlDeleteMesureMappingMutation$variables = {
  input: DeleteControlMesureMappingInput;
};
export type ControlDeleteMesureMappingMutation$data = {
  readonly deleteControlMesureMapping: {
    readonly success: boolean;
  };
};
export type ControlDeleteMesureMappingMutation = {
  response: ControlDeleteMesureMappingMutation$data;
  variables: ControlDeleteMesureMappingMutation$variables;
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
    "concreteType": "DeleteControlMesureMappingPayload",
    "kind": "LinkedField",
    "name": "deleteControlMesureMapping",
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
    "name": "ControlDeleteMesureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlDeleteMesureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "66b2b12e57f8a150825f0e3f25494093",
    "id": null,
    "metadata": {},
    "name": "ControlDeleteMesureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeleteMesureMappingMutation(\n  $input: DeleteControlMesureMappingInput!\n) {\n  deleteControlMesureMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "64e6f03a12a22a87e4893a335e58379b";

export default node;
