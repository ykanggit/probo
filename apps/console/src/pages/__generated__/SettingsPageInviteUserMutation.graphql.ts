/**
 * @generated SignedSource<<7eb47f6f0589a4b7c7e65fd4c313422c>>
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
export type SettingsPageInviteUserMutation$variables = {
  input: InviteUserInput;
};
export type SettingsPageInviteUserMutation$data = {
  readonly inviteUser: {
    readonly success: boolean;
  };
};
export type SettingsPageInviteUserMutation = {
  response: SettingsPageInviteUserMutation$data;
  variables: SettingsPageInviteUserMutation$variables;
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
    "name": "SettingsPageInviteUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsPageInviteUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "732d61a66a202dc879bb81c72fb2fb24",
    "id": null,
    "metadata": {},
    "name": "SettingsPageInviteUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsPageInviteUserMutation(\n  $input: InviteUserInput!\n) {\n  inviteUser(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "d09b74116ff70680029667104b5b34db";

export default node;
