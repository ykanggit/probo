/**
 * @generated SignedSource<<9e8a7131004ab3ef4f20c36c904bd9db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateControlPolicyMappingInput = {
  controlId: string;
  policyId: string;
};
export type ControlCreatePolicyMappingMutation$variables = {
  input: CreateControlPolicyMappingInput;
};
export type ControlCreatePolicyMappingMutation$data = {
  readonly createControlPolicyMapping: {
    readonly controlEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  };
};
export type ControlCreatePolicyMappingMutation = {
  response: ControlCreatePolicyMappingMutation$data;
  variables: ControlCreatePolicyMappingMutation$variables;
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
    "concreteType": "CreateControlPolicyMappingPayload",
    "kind": "LinkedField",
    "name": "createControlPolicyMapping",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ControlEdge",
        "kind": "LinkedField",
        "name": "controlEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Control",
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
    "name": "ControlCreatePolicyMappingMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlCreatePolicyMappingMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d2cf3e45fcc9109399c3b80addb03b20",
    "id": null,
    "metadata": {},
    "name": "ControlCreatePolicyMappingMutation",
    "operationKind": "mutation",
    "text": "mutation ControlCreatePolicyMappingMutation(\n  $input: CreateControlPolicyMappingInput!\n) {\n  createControlPolicyMapping(input: $input) {\n    controlEdge {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9deabb78c91eca04673b23cf5d0b68f5";

export default node;
