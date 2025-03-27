/**
 * @generated SignedSource<<39cfe3277c49d7a0ff2099d6ad579e7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type MitigationState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type UpdateMitigationInput = {
  category?: string | null | undefined;
  description?: string | null | undefined;
  expectedVersion: number;
  id: string;
  importance?: MitigationImportance | null | undefined;
  name?: string | null | undefined;
  state?: MitigationState | null | undefined;
};
export type UpdateMitigationViewUpdateMitigationMutation$variables = {
  input: UpdateMitigationInput;
};
export type UpdateMitigationViewUpdateMitigationMutation$data = {
  readonly updateMitigation: {
    readonly mitigation: {
      readonly category: string;
      readonly description: string;
      readonly id: string;
      readonly importance: MitigationImportance;
      readonly name: string;
      readonly state: MitigationState;
      readonly version: number;
    };
  };
};
export type UpdateMitigationViewUpdateMitigationMutation = {
  response: UpdateMitigationViewUpdateMitigationMutation$data;
  variables: UpdateMitigationViewUpdateMitigationMutation$variables;
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
    "concreteType": "UpdateMitigationPayload",
    "kind": "LinkedField",
    "name": "updateMitigation",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Mitigation",
        "kind": "LinkedField",
        "name": "mitigation",
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
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "importance",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "version",
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
    "name": "UpdateMitigationViewUpdateMitigationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateMitigationViewUpdateMitigationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5ebe3d38712b444c98c08661b7431da3",
    "id": null,
    "metadata": {},
    "name": "UpdateMitigationViewUpdateMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateMitigationViewUpdateMitigationMutation(\n  $input: UpdateMitigationInput!\n) {\n  updateMitigation(input: $input) {\n    mitigation {\n      id\n      name\n      description\n      category\n      importance\n      state\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c68d76d527359d182749b309d2d8d6dd";

export default node;
