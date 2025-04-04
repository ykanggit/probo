/**
 * @generated SignedSource<<2026b385ee5eb895da6ca9c919762913>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "ACTIVE" | "DRAFT";
export type CreatePolicyInput = {
  content: string;
  name: string;
  organizationId: string;
  ownerId: string;
  reviewDate?: string | null | undefined;
  status: PolicyStatus;
};
export type NewPolicyViewMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreatePolicyInput;
};
export type NewPolicyViewMutation$data = {
  readonly createPolicy: {
    readonly policyEdge: {
      readonly node: {
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
};
export type NewPolicyViewMutation = {
  response: NewPolicyViewMutation$data;
  variables: NewPolicyViewMutation$variables;
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "PolicyEdge",
  "kind": "LinkedField",
  "name": "policyEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Policy",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v3/*: any*/),
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
            (v3/*: any*/),
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewPolicyViewMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreatePolicyPayload",
        "kind": "LinkedField",
        "name": "createPolicy",
        "plural": false,
        "selections": [
          (v4/*: any*/)
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
    "name": "NewPolicyViewMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreatePolicyPayload",
        "kind": "LinkedField",
        "name": "createPolicy",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "policyEdge",
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
    "cacheID": "aa29cde3106d1c8d35c6ae8e74f310b7",
    "id": null,
    "metadata": {},
    "name": "NewPolicyViewMutation",
    "operationKind": "mutation",
    "text": "mutation NewPolicyViewMutation(\n  $input: CreatePolicyInput!\n) {\n  createPolicy(input: $input) {\n    policyEdge {\n      node {\n        id\n        name\n        content\n        status\n        reviewDate\n        owner {\n          id\n          fullName\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f6dcabf6c51e3858c9750e00fcc0cc15";

export default node;
