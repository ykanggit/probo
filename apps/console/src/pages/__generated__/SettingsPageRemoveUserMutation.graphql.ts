/**
 * @generated SignedSource<<9d909d5fc7076593317b01aab165513d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RemoveUserInput = {
  organizationId: string;
  userId: string;
};
export type SettingsPageRemoveUserMutation$variables = {
  input: RemoveUserInput;
};
export type SettingsPageRemoveUserMutation$data = {
  readonly removeUser: {
    readonly success: boolean;
  };
};
export type SettingsPageRemoveUserMutation = {
  response: SettingsPageRemoveUserMutation$data;
  variables: SettingsPageRemoveUserMutation$variables;
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
    "concreteType": "RemoveUserPayload",
    "kind": "LinkedField",
    "name": "removeUser",
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
    "name": "SettingsPageRemoveUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsPageRemoveUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "62588cd355b82b5a48d0b539a009b3bd",
    "id": null,
    "metadata": {},
    "name": "SettingsPageRemoveUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsPageRemoveUserMutation(\n  $input: RemoveUserInput!\n) {\n  removeUser(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d375bb2dfdab0f9d9520eee9f732b10";

export default node;
