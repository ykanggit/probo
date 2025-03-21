/**
 * @generated SignedSource<<9a97197f1f0eec8c00d0a58e0b07e8bc>>
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
  ownerId?: string | null | undefined;
  reviewDate?: string | null | undefined;
  status?: PolicyStatus | null | undefined;
};
export type UpdatePolicyViewMutation$variables = {
  input: UpdatePolicyInput;
};
export type UpdatePolicyViewMutation$data = {
  readonly updatePolicy: {
    readonly policy: {
      readonly content: string;
      readonly id: string;
      readonly name: string;
      readonly owner: {
        readonly fullName: string;
        readonly id: string;
      };
      readonly reviewDate: string | null | undefined;
      readonly status: PolicyStatus;
      readonly version: number;
    };
  };
};
export type UpdatePolicyViewMutation = {
  response: UpdatePolicyViewMutation$data;
  variables: UpdatePolicyViewMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
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
          (v1/*: any*/),
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
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
    "name": "UpdatePolicyViewMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdatePolicyViewMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "1ba586009eaf6e79dd2ab5862856cc63",
    "id": null,
    "metadata": {},
    "name": "UpdatePolicyViewMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePolicyViewMutation(\n  $input: UpdatePolicyInput!\n) {\n  updatePolicy(input: $input) {\n    policy {\n      id\n      name\n      content\n      status\n      version\n      reviewDate\n      owner {\n        id\n        fullName\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "47570dfcceba283c51a4ef2f88143d39";

export default node;
