/**
 * @generated SignedSource<<ef4c93d248af00040b679e1bdb225a64>>
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
  id: string;
  importance?: MitigationImportance | null | undefined;
  name?: string | null | undefined;
  state?: MitigationState | null | undefined;
};
export type EditMitigationViewUpdateMitigationMutation$variables = {
  input: UpdateMitigationInput;
};
export type EditMitigationViewUpdateMitigationMutation$data = {
  readonly updateMitigation: {
    readonly mitigation: {
      readonly description: string;
      readonly id: string;
      readonly name: string;
    };
  };
};
export type EditMitigationViewUpdateMitigationMutation = {
  response: EditMitigationViewUpdateMitigationMutation$data;
  variables: EditMitigationViewUpdateMitigationMutation$variables;
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
    "name": "EditMitigationViewUpdateMitigationMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditMitigationViewUpdateMitigationMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b28b509d2111119e074541df44720f4f",
    "id": null,
    "metadata": {},
    "name": "EditMitigationViewUpdateMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation EditMitigationViewUpdateMitigationMutation(\n  $input: UpdateMitigationInput!\n) {\n  updateMitigation(input: $input) {\n    mitigation {\n      id\n      name\n      description\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "30ac146016e936fd8912b480286c93de";

export default node;
