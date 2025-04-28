/**
 * @generated SignedSource<<290d3c4fb382c7b99c60eeee5cfa8c5a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyStatus = "DRAFT" | "PUBLISHED";
export type CreateDraftPolicyVersionInput = {
  policyID: string;
};
export type ShowPolicyViewCreateDraftMutation$variables = {
  input: CreateDraftPolicyVersionInput;
};
export type ShowPolicyViewCreateDraftMutation$data = {
  readonly createDraftPolicyVersion: {
    readonly policyVersionEdge: {
      readonly node: {
        readonly id: string;
        readonly status: PolicyStatus;
        readonly version: number;
      };
    };
  };
};
export type ShowPolicyViewCreateDraftMutation = {
  response: ShowPolicyViewCreateDraftMutation$data;
  variables: ShowPolicyViewCreateDraftMutation$variables;
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
    "concreteType": "CreateDraftPolicyVersionPayload",
    "kind": "LinkedField",
    "name": "createDraftPolicyVersion",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PolicyVersionEdge",
        "kind": "LinkedField",
        "name": "policyVersionEdge",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PolicyVersion",
            "kind": "LinkedField",
            "name": "node",
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
                "name": "version",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
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
    "name": "ShowPolicyViewCreateDraftMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowPolicyViewCreateDraftMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e96d226e93260cd989dc122193fbcbce",
    "id": null,
    "metadata": {},
    "name": "ShowPolicyViewCreateDraftMutation",
    "operationKind": "mutation",
    "text": "mutation ShowPolicyViewCreateDraftMutation(\n  $input: CreateDraftPolicyVersionInput!\n) {\n  createDraftPolicyVersion(input: $input) {\n    policyVersionEdge {\n      node {\n        id\n        version\n        status\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "49282edca41fc2bdca1a1c6db4b2dc11";

export default node;
