/**
 * @generated SignedSource<<885dc2a54ba3b8d4663e197cfe61d704>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreatePolicyInput = {
  content: string;
  organizationId: string;
  ownerId: string;
  title: string;
};
export type PolicyListViewCreateMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreatePolicyInput;
};
export type PolicyListViewCreateMutation$data = {
  readonly createPolicy: {
    readonly policyEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly owner: {
          readonly fullName: string;
          readonly id: string;
        };
        readonly title: string;
        readonly updatedAt: string;
      };
    };
  };
};
export type PolicyListViewCreateMutation = {
  response: PolicyListViewCreateMutation$data;
  variables: PolicyListViewCreateMutation$variables;
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
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
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
    "name": "PolicyListViewCreateMutation",
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
    "name": "PolicyListViewCreateMutation",
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
    "cacheID": "f7aae6d7a0d276e71caec643e43b5ee5",
    "id": null,
    "metadata": {},
    "name": "PolicyListViewCreateMutation",
    "operationKind": "mutation",
    "text": "mutation PolicyListViewCreateMutation(\n  $input: CreatePolicyInput!\n) {\n  createPolicy(input: $input) {\n    policyEdge {\n      node {\n        id\n        title\n        description\n        createdAt\n        updatedAt\n        owner {\n          id\n          fullName\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d55ac010a7ad352d830d3a38f2f8d5a8";

export default node;
