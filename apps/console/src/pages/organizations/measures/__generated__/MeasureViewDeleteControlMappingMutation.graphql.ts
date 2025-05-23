/**
 * @generated SignedSource<<c903592f9282d20a2a8d28f0907be974>>
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
export type MeasureViewDeleteControlMappingMutation$variables = {
  input: DeleteControlMeasureMappingInput;
};
export type MeasureViewDeleteControlMappingMutation$data = {
  readonly deleteControlMeasureMapping: {
    readonly deletedMeasureId: string;
  };
};
export type MeasureViewDeleteControlMappingMutation = {
  response: MeasureViewDeleteControlMappingMutation$data;
  variables: MeasureViewDeleteControlMappingMutation$variables;
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
    "name": "MeasureViewDeleteControlMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MeasureViewDeleteControlMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7cdb64662f8f7c05b6ab0698c234970f",
    "id": null,
    "metadata": {},
    "name": "MeasureViewDeleteControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MeasureViewDeleteControlMappingMutation(\n  $input: DeleteControlMeasureMappingInput!\n) {\n  deleteControlMeasureMapping(input: $input) {\n    deletedMeasureId\n  }\n}\n"
  }
};
})();

(node as any).hash = "73049774597ac1235e58527f7aa46564";

export default node;
