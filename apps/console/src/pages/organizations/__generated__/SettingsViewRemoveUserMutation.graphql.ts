/**
 * @generated SignedSource<<83fe53df5d49d9e2441a2e02dfaa63ee>>
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
export type SettingsViewRemoveUserMutation$variables = {
  input: RemoveUserInput;
};
export type SettingsViewRemoveUserMutation$data = {
  readonly removeUser: {
    readonly success: boolean;
  };
};
export type SettingsViewRemoveUserMutation = {
  response: SettingsViewRemoveUserMutation$data;
  variables: SettingsViewRemoveUserMutation$variables;
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
    "name": "SettingsViewRemoveUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsViewRemoveUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4a8d30e01815dbee5f216bbacf9f39e6",
    "id": null,
    "metadata": {},
    "name": "SettingsViewRemoveUserMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsViewRemoveUserMutation(\n  $input: RemoveUserInput!\n) {\n  removeUser(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "a6446703d214b8c6c436aabed2d78dd7";

export default node;
