/**
 * @generated SignedSource<<0a4cb496e3dd17d135eaa689ebba360a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskPolicyMappingInput = {
  policyId: string;
  riskId: string;
};
export type ShowRiskViewCreateRiskPolicyMappingMutation$variables = {
  input: CreateRiskPolicyMappingInput;
};
export type ShowRiskViewCreateRiskPolicyMappingMutation$data = {
  readonly createRiskPolicyMapping: {
    readonly riskEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type ShowRiskViewCreateRiskPolicyMappingMutation = {
  response: ShowRiskViewCreateRiskPolicyMappingMutation$data;
  variables: ShowRiskViewCreateRiskPolicyMappingMutation$variables;
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
    "concreteType": "CreateRiskPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "createRiskPolicyMapping",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RiskEdge",
        "kind": "LinkedField",
        "name": "riskEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Risk",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "57ab115614eb72c930a05a4496827702",
    "id": null,
    "metadata": {},
    "name": "ShowRiskViewCreateRiskPolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ShowRiskViewCreateRiskPolicyMappingMutation(\n  $input: CreateRiskPolicyMappingInput!\n) {\n  createRiskPolicyMapping(input: $input) {\n    riskEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ca3e1eee912cd4b7ac2702e4192dd544";

export default node;
