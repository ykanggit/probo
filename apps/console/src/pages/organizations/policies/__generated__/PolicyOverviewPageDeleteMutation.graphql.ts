/**
 * @generated SignedSource<<3f819f2e923960fed57f95a4535782be>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeletePolicyInput = {
  policyId: string;
};
export type PolicyOverviewPageDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeletePolicyInput;
};
export type PolicyOverviewPageDeleteMutation$data = {
  readonly deletePolicy: {
    readonly deletedPolicyId: string;
  };
};
export type PolicyOverviewPageDeleteMutation = {
  response: PolicyOverviewPageDeleteMutation$data;
  variables: PolicyOverviewPageDeleteMutation$variables;
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
  "name": "deletedPolicyId",
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
    "name": "PolicyOverviewPageDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeletePolicyPayload",
        "kind": "LinkedField",
        "name": "deletePolicy",
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
    "name": "PolicyOverviewPageDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeletePolicyPayload",
        "kind": "LinkedField",
        "name": "deletePolicy",
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
            "name": "deletedPolicyId",
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
    "cacheID": "0a54108fe8b1d0e8c306ede62182d0b4",
    "id": null,
    "metadata": {},
    "name": "PolicyOverviewPageDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PolicyOverviewPageDeleteMutation(\n  $input: DeletePolicyInput!\n) {\n  deletePolicy(input: $input) {\n    deletedPolicyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "2ca6b448cda30ef9d66197344469c15b";

export default node;
