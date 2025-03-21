/**
 * @generated SignedSource<<c68c659132315eb3f36849f37a95fef8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type InviteUserInput = {
  email: string;
  fullName: string;
  organizationId: string;
};
export type SettingsViewInviteUserMutation$variables = {
  input: InviteUserInput;
};
export type SettingsViewInviteUserMutation$data = {
  readonly inviteUser: {
    readonly success: boolean;
  };
};
export type SettingsViewInviteUserMutation = {
  response: SettingsViewInviteUserMutation$data;
  variables: SettingsViewInviteUserMutation$variables;
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
    "concreteType": "InviteUserPayload",
    "kind": "LinkedField",
    "name": "inviteUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "SettingsViewInviteUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsViewInviteUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08abe9c261dc68b1c76991ad5e6f4d95",
    "id": null,
    "metadata": {},
    "name": "SettingsViewInviteUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsViewInviteUserMutation(\n  $input: InviteUserInput!\n) {\n  inviteUser(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "5e95d05ee3c0d58f9413790a4a9516bf";

export default node;
