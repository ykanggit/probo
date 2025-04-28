/**
 * @generated SignedSource<<024ec8d58aa5f37adad3ac5e98c15a90>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "DRAFT" | "PUBLISHED";
export type PublishPolicyVersionInput = {
  policyId: string;
};
export type ShowPolicyViewPublishMutation$variables = {
  input: PublishPolicyVersionInput;
};
export type ShowPolicyViewPublishMutation$data = {
  readonly publishPolicyVersion: {
    readonly policy: {
      readonly currentPublishedVersion: number | null | undefined;
      readonly id: string;
    };
    readonly policyVersion: {
      readonly id: string;
      readonly publishedAt: string | null | undefined;
      readonly publishedBy: {
        readonly fullName: string;
      } | null | undefined;
      readonly status: PolicyStatus;
    };
  };
};
export type ShowPolicyViewPublishMutation = {
  response: ShowPolicyViewPublishMutation$data;
  variables: ShowPolicyViewPublishMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Policy",
  "kind": "LinkedField",
  "name": "policy",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currentPublishedVersion",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "publishedAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowPolicyViewPublishMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PublishPolicyVersionPayload",
        "kind": "LinkedField",
        "name": "publishPolicyVersion",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PolicyVersion",
            "kind": "LinkedField",
            "name": "policyVersion",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "People",
                "kind": "LinkedField",
                "name": "publishedBy",
                "plural": false,
                "selections": [
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowPolicyViewPublishMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "PublishPolicyVersionPayload",
        "kind": "LinkedField",
        "name": "publishPolicyVersion",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "PolicyVersion",
            "kind": "LinkedField",
            "name": "policyVersion",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "People",
                "kind": "LinkedField",
                "name": "publishedBy",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2047a011abeae6642230cb7b31080b08",
    "id": null,
    "metadata": {},
    "name": "ShowPolicyViewPublishMutation",
    "operationKind": "mutation",
    "text": "mutation ShowPolicyViewPublishMutation(\n  $input: PublishPolicyVersionInput!\n) {\n  publishPolicyVersion(input: $input) {\n    policy {\n      id\n      currentPublishedVersion\n    }\n    policyVersion {\n      id\n      status\n      publishedAt\n      publishedBy {\n        fullName\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d81485a797858cf5f2834cf131d248cc";

export default node;
