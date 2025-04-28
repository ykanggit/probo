/**
 * @generated SignedSource<<d8d76cb73e37916ddc34017550ff3702>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdatePolicyVersionInput = {
  content: string;
  policyVersionId: string;
};
export type EditPolicyViewMutation$variables = {
  input: UpdatePolicyVersionInput;
};
export type EditPolicyViewMutation$data = {
  readonly updatePolicyVersion: {
    readonly policyVersion: {
      readonly content: string;
      readonly id: string;
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
    "concreteType": "UpdatePolicyVersionPayload",
    "kind": "LinkedField",
    "name": "updatePolicyVersion",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "PolicyVersion",
        "kind": "LinkedField",
        "name": "policyVersion",
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
            "name": "content",
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
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditPolicyViewMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "02b56043d606c6237dd502a7695fea50",
    "id": null,
    "metadata": {},
    "name": "EditPolicyViewMutation",
    "operationKind": "mutation",
    "text": "mutation EditPolicyViewMutation(\n  $input: UpdatePolicyVersionInput!\n) {\n  updatePolicyVersion(input: $input) {\n    policyVersion {\n      id\n      content\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "556fbcc4fadc0011c1a2154dcffeb389";

export default node;
