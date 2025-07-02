/**
 * @generated SignedSource<<e52ff21c6805e96937d86b9132e82bd6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateOrganizationInput = {
  companyDescription?: string | null | undefined;
  companyLegalName?: string | null | undefined;
  logo?: any | null | undefined;
  mailingAddress?: string | null | undefined;
  name?: string | null | undefined;
  organizationId: string;
  securityComplianceEmail?: string | null | undefined;
  telephoneNumber?: string | null | undefined;
  websiteUrl?: string | null | undefined;
};
export type SettingsPage_UpdateMutation$variables = {
  input: UpdateOrganizationInput;
};
export type SettingsPage_UpdateMutation$data = {
  readonly updateOrganization: {
    readonly organization: {
      readonly companyDescription: string | null | undefined;
      readonly companyLegalName: string | null | undefined;
      readonly id: string;
      readonly logoUrl: string | null | undefined;
      readonly mailingAddress: string | null | undefined;
      readonly name: string;
      readonly securityComplianceEmail: string | null | undefined;
      readonly telephoneNumber: string | null | undefined;
      readonly websiteUrl: string | null | undefined;
    };
  };
};
export type SettingsPage_UpdateMutation = {
  response: SettingsPage_UpdateMutation$data;
  variables: SettingsPage_UpdateMutation$variables;
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mailingAddress",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "telephoneNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "websiteUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "securityComplianceEmail",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "companyDescription",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "companyLegalName",
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
    "name": "SettingsPage_UpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SettingsPage_UpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "772ca4c2fc43f18362d828d132c065bd",
    "id": null,
    "metadata": {},
    "name": "SettingsPage_UpdateMutation",
    "operationKind": "mutation",
    "text": "mutation SettingsPage_UpdateMutation(\n  $input: UpdateOrganizationInput!\n) {\n  updateOrganization(input: $input) {\n    organization {\n      id\n      name\n      logoUrl\n      mailingAddress\n      telephoneNumber\n      websiteUrl\n      securityComplianceEmail\n      companyDescription\n      companyLegalName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "28d9dbbbb7d88b90f304c04a8673a334";

export default node;
