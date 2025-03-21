/**
 * @generated SignedSource<<f4b385701b9d41fb1d7617694a08c117>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationInput = {
  logo?: any | null | undefined;
  name?: string | null | undefined;
  organizationId: string;
};
export type SettingsViewUpdateOrganizationMutation$variables = {
  input: UpdateOrganizationInput;
};
export type SettingsViewUpdateOrganizationMutation$data = {
  readonly updateOrganization: {
    readonly organization: {
      readonly id: string;
      readonly logoUrl: string | null | undefined;
      readonly name: string;
    };
  };
};
export type SettingsViewUpdateOrganizationMutation = {
  response: SettingsViewUpdateOrganizationMutation$data;
  variables: SettingsViewUpdateOrganizationMutation$variables;
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
    "concreteType": "UpdateOrganizationPayload",
    "kind": "LinkedField",
    "name": "updateOrganization",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "logoUrl",
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
    "name": "SettingsViewUpdateOrganizationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsViewUpdateOrganizationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f2a2984a2d4e764019f4355c13dab46e",
    "id": null,
    "metadata": {},
    "name": "SettingsViewUpdateOrganizationMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsViewUpdateOrganizationMutation(\n  $input: UpdateOrganizationInput!\n) {\n  updateOrganization(input: $input) {\n    organization {\n      id\n      name\n      logoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9570926c4f654570cbfe7328cd9893d6";

export default node;
