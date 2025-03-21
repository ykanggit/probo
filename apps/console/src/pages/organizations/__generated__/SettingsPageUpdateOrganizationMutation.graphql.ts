/**
 * @generated SignedSource<<76018198697d82d6f630558618c6aaff>>
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
export type SettingsPageUpdateOrganizationMutation$variables = {
  input: UpdateOrganizationInput;
};
export type SettingsPageUpdateOrganizationMutation$data = {
  readonly updateOrganization: {
    readonly organization: {
      readonly id: string;
      readonly logoUrl: string | null | undefined;
      readonly name: string;
    };
  };
};
export type SettingsPageUpdateOrganizationMutation = {
  response: SettingsPageUpdateOrganizationMutation$data;
  variables: SettingsPageUpdateOrganizationMutation$variables;
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
    "name": "SettingsPageUpdateOrganizationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsPageUpdateOrganizationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2bf2a6e054aed9bd337372682342a30f",
    "id": null,
    "metadata": {},
    "name": "SettingsPageUpdateOrganizationMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsPageUpdateOrganizationMutation(\n  $input: UpdateOrganizationInput!\n) {\n  updateOrganization(input: $input) {\n    organization {\n      id\n      name\n      logoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "737ec44a08ac05e9f78827811cc0ca0e";

export default node;
