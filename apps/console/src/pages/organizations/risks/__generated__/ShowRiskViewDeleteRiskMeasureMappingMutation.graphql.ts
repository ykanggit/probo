/**
 * @generated SignedSource<<dbef3ce0074f8f10185181eab091a2eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskMeasureMappingInput = {
  measureId: string;
  riskId: string;
};
export type ShowRiskViewDeleteRiskMeasureMappingMutation$variables = {
  input: DeleteRiskMeasureMappingInput;
};
export type ShowRiskViewDeleteRiskMeasureMappingMutation$data = {
  readonly deleteRiskMeasureMapping: {
    readonly deletedMeasureId: string;
  };
};
export type ShowRiskViewDeleteRiskMeasureMappingMutation = {
  response: ShowRiskViewDeleteRiskMeasureMappingMutation$data;
  variables: ShowRiskViewDeleteRiskMeasureMappingMutation$variables;
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
    "concreteType": "DeleteRiskMeasureMappingPayload",
    "kind": "LinkedField",
    "name": "deleteRiskMeasureMapping",
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
    "name": "ShowRiskViewDeleteRiskMeasureMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewDeleteRiskMeasureMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7d0915a443335171854ece73a62d38d8",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewDeleteRiskMeasureMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewDeleteRiskMeasureMappingMutation(\n  $input: DeleteRiskMeasureMappingInput!\n) {\n  deleteRiskMeasureMapping(input: $input) {\n    deletedMeasureId\n  }\n}\n"
  }
};
})();

(node as any).hash = "f6dbd4c81c9c6cc167ee8816a1f698cc";

export default node;
