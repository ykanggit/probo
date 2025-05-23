/**
 * @generated SignedSource<<92ccd3ebf9c0f657aa025589621b5bb9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteControlMeasureMappingInput = {
  controlId: string;
  measureId: string;
};
export type ControlDeleteMeasureMappingMutation$variables = {
  input: DeleteControlMeasureMappingInput;
};
export type ControlDeleteMeasureMappingMutation$data = {
  readonly deleteControlMeasureMapping: {
    readonly deletedMeasureId: string;
  };
};
export type ControlDeleteMeasureMappingMutation = {
  response: ControlDeleteMeasureMappingMutation$data;
  variables: ControlDeleteMeasureMappingMutation$variables;
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
    "concreteType": "DeleteControlMeasureMappingPayload",
    "kind": "LinkedField",
    "name": "deleteControlMeasureMapping",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedMeasureId",
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
    "name": "ControlDeleteMeasureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlDeleteMeasureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f04fc5d41446167e628d231693adacb5",
    "id": null,
    "metadata": {},
    "name": "ControlDeleteMeasureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlDeleteMeasureMappingMutation(\n  $input: DeleteControlMeasureMappingInput!\n) {\n  deleteControlMeasureMapping(input: $input) {\n    deletedMeasureId\n  }\n}\n"
  }
};
})();

(node as any).hash = "3585131b3599d0926a1e53979eafc0a3";

export default node;
