/**
 * @generated SignedSource<<171200736f3a443faae3f8b7c2085f4f>>
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
  id: string;
  name?: string | null | undefined;
  ownerId?: string | null | undefined;
  reviewDate?: string | null | undefined;
  status?: PolicyStatus | null | undefined;
};
export type EditPolicyViewMutation$variables = {
  input: UpdatePolicyInput;
};
export type EditPolicyViewMutation$data = {
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
    };
  };
};
export type EditPolicyViewMutation = {
  response: EditPolicyViewMutation$data;
  variables: EditPolicyViewMutation$variables;
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
    "name": "EditPolicyViewMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditPolicyViewMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "643990a3ab54cb51144f434b023531e7",
    "id": null,
    "metadata": {},
    "name": "EditPolicyViewMutation",
    "operationKind": "mutation",
    "text": "mutation EditPolicyViewMutation(\n  $input: UpdatePolicyInput!\n) {\n  updatePolicy(input: $input) {\n    policy {\n      id\n      name\n      content\n      status\n      reviewDate\n      owner {\n        id\n        fullName\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "41d4945568bc1f43eeedc727a968654d";

export default node;
