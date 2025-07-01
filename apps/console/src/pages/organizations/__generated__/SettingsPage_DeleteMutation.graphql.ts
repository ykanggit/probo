/**
 * @generated SignedSource<<17676c833b06274c0311caedf646795e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteOrganizationInput = {
  organizationId: string;
};
export type SettingsPage_DeleteMutation$variables = {
  input: DeleteOrganizationInput;
};
export type SettingsPage_DeleteMutation$data = {
  readonly deleteOrganization: {
    readonly success: boolean;
  };
};
export type SettingsPage_DeleteMutation = {
  response: SettingsPage_DeleteMutation$data;
  variables: SettingsPage_DeleteMutation$variables;
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
    "concreteType": "DeleteOrganizationPayload",
    "kind": "LinkedField",
    "name": "deleteOrganization",
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
    "name": "SettingsPage_DeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsPage_DeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f3277eea6a4ac935b3b7cf73013e434a",
    "id": null,
    "metadata": {},
    "name": "SettingsPage_DeleteMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsPage_DeleteMutation(\n  $input: DeleteOrganizationInput!\n) {\n  deleteOrganization(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "fa98a02cf81c00582c8dd8f882f7f070";

export default node;
