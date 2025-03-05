/**
 * @generated SignedSource<<f37225ac5a4b6774dadbd4f23c3bbfe9>>
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
export type UpdatePolicyPageMutation$variables = {
  input: UpdatePolicyInput;
};
export type UpdatePolicyPageMutation$data = {
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
    "name": "UpdatePolicyPageMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdatePolicyPageMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "cab3ba1fb88944fade60b5d6a0e0b7b9",
    "id": null,
    "metadata": {},
    "name": "UpdatePolicyPageMutation",
    "operationKind": "mutation",
    "text": "mutation UpdatePolicyPageMutation(\n  $input: UpdatePolicyInput!\n) {\n  updatePolicy(input: $input) {\n    policy {\n      id\n      name\n      content\n      status\n      version\n      reviewDate\n      owner {\n        id\n        fullName\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "51e4a0e297540f4e83dcb6d809430ac7";

export default node;
