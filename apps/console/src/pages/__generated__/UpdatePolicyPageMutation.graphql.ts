/**
 * @generated SignedSource<<9a54ece29b9ff9a2efa624f67f40f803>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "ACTIVE" | "DRAFT";
export type UpdatePolicyInput = {
  content?: string | null | undefined;
  expectedVersion: number;
  id: string;
  name?: string | null | undefined;
  reviewDate?: string | null | undefined;
  status?: PolicyStatus | null | undefined;
};
export type UpdatePolicyPageMutation$variables = {
  input: UpdatePolicyInput;
};
export type UpdatePolicyPageMutation$data = {
  readonly updatePolicy: {
    readonly policy: {
      readonly content: string;
      readonly id: string;
      readonly name: string;
      readonly reviewDate: string | null | undefined;
      readonly status: PolicyStatus;
      readonly version: number;
    };
  };
};
export type UpdatePolicyPageMutation = {
  response: UpdatePolicyPageMutation$data;
  variables: UpdatePolicyPageMutation$variables;
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
    "concreteType": "UpdatePolicyPayload",
    "kind": "LinkedField",
    "name": "updatePolicy",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Policy",
        "kind": "LinkedField",
        "name": "policy",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "content",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "version",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "reviewDate",
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
    "name": "UpdatePolicyPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdatePolicyPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ce2ccf9449b52e3df3b2b9bb82c55166",
    "id": null,
    "metadata": {},
    "name": "UpdatePolicyPageMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePolicyPageMutation(\n  $input: UpdatePolicyInput!\n) {\n  updatePolicy(input: $input) {\n    policy {\n      id\n      name\n      content\n      status\n      version\n      reviewDate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d5329966d0e13b8931d6f01d9afb74e2";

export default node;
