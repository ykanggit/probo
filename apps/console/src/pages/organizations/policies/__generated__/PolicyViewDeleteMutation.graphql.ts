/**
 * @generated SignedSource<<4e559f39bd9ec2b3782113ef034cad03>>
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
export type PolicyViewDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeletePolicyInput;
};
export type PolicyViewDeleteMutation$data = {
  readonly deletePolicy: {
    readonly deletedPolicyId: string;
  };
};
export type PolicyViewDeleteMutation = {
  response: PolicyViewDeleteMutation$data;
  variables: PolicyViewDeleteMutation$variables;
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
    "name": "PolicyViewDeleteMutation",
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
    "name": "PolicyViewDeleteMutation",
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
    "cacheID": "67e67147e0c7ec0489346b1ad86899c9",
    "id": null,
    "metadata": {},
    "name": "PolicyViewDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PolicyViewDeleteMutation(\n  $input: DeletePolicyInput!\n) {\n  deletePolicy(input: $input) {\n    deletedPolicyId\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d421e9b068f3f676a4c3069769b1c18";

export default node;
