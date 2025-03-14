/**
 * @generated SignedSource<<8326ebf0af891dd062245db55f40abba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ConfirmInvitationInput = {
  password: string;
  token: string;
};
export type ConfirmInvitationPageMutation$variables = {
  input: ConfirmInvitationInput;
};
export type ConfirmInvitationPageMutation$data = {
  readonly confirmInvitation: {
    readonly success: boolean;
  };
};
export type ConfirmInvitationPageMutation = {
  response: ConfirmInvitationPageMutation$data;
  variables: ConfirmInvitationPageMutation$variables;
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
    "concreteType": "ConfirmInvitationPayload",
    "kind": "LinkedField",
    "name": "confirmInvitation",
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
    "name": "ConfirmInvitationPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ConfirmInvitationPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b274132385a2cb59047b47de69712aa8",
    "id": null,
    "metadata": {},
    "name": "ConfirmInvitationPageMutation",
    "operationKind": "mutation",
    "text": "mutation ConfirmInvitationPageMutation(\n  $input: ConfirmInvitationInput!\n) {\n  confirmInvitation(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "f1f013a448277ebffb14e954b2c1797c";

export default node;
