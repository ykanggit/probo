/**
 * @generated SignedSource<<349d62a3a4ed3ea1d83c12f0c61437dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteRiskInput = {
  riskId: string;
};
export type RiskListViewDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteRiskInput;
};
export type RiskListViewDeleteMutation$data = {
  readonly deleteRisk: {
    readonly deletedRiskId: string;
  };
};
export type RiskListViewDeleteMutation = {
  response: RiskListViewDeleteMutation$data;
  variables: RiskListViewDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedRiskId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RiskListViewDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteRiskPayload",
        "kind": "LinkedField",
        "name": "deleteRisk",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "RiskListViewDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteRiskPayload",
        "kind": "LinkedField",
        "name": "deleteRisk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedRiskId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "525011737d0920883b3942d2603dc31f",
    "id": null,
    "metadata": {},
    "name": "RiskListViewDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation RiskListViewDeleteMutation(\n  $input: DeleteRiskInput!\n) {\n  deleteRisk(input: $input) {\n    deletedRiskId\n  }\n}\n"
  }
};
})();

(node as any).hash = "4aee92e5abfd6733b44588bf01276560";

export default node;
