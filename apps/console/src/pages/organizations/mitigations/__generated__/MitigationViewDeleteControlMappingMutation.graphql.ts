/**
 * @generated SignedSource<<f34a09cd4eda414409384386a4cea5b4>>
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
export type MitigationViewDeleteControlMappingMutation$variables = {
  input: DeleteControlMitigationMappingInput;
};
export type MitigationViewDeleteControlMappingMutation$data = {
  readonly deleteControlMitigationMapping: {
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
    "cacheID": "b18a11215ba33a6c770cc08c88a28769",
    "id": null,
    "metadata": {},
    "name": "MitigationViewDeleteControlMappingMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewDeleteControlMappingMutation(\n  $input: DeleteControlMitigationMappingInput!\n) {\n  deleteControlMitigationMapping(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "f4f01abb45a3288558d7e8a1d19ce1ed";

export default node;
