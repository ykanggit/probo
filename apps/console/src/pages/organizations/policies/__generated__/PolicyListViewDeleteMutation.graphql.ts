/**
 * @generated SignedSource<<c71120e2c59cabbcb2f9e55dacd2be6c>>
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
export type PolicyListViewDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeletePolicyInput;
};
export type PolicyListViewDeleteMutation$data = {
  readonly deletePolicy: {
    readonly deletedPolicyId: string;
  };
};
export type PolicyListViewDeleteMutation = {
  response: PolicyListViewDeleteMutation$data;
  variables: PolicyListViewDeleteMutation$variables;
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
    "name": "PolicyListViewDeleteMutation",
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
    "name": "PolicyListViewDeleteMutation",
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
    "cacheID": "3a182fce4a0616599bea274ddf7b95a1",
    "id": null,
    "metadata": {},
    "name": "PolicyListViewDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PolicyListViewDeleteMutation(\n  $input: DeletePolicyInput!\n) {\n  deletePolicy(input: $input) {\n    deletedPolicyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "d2a47c3563b6dcbbb88e78b954345768";

export default node;
