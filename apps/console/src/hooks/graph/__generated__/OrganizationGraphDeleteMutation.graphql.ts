/**
 * @generated SignedSource<<4c0f8b7da3434de8036a0a24cf89a7ba>>
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
export type OrganizationGraphDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteOrganizationInput;
};
export type OrganizationGraphDeleteMutation$data = {
  readonly deleteOrganization: {
    readonly deletedOrganizationId: string;
  };
};
export type OrganizationGraphDeleteMutation = {
  response: OrganizationGraphDeleteMutation$data;
  variables: OrganizationGraphDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedOrganizationId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationGraphDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteOrganizationPayload",
        "kind": "LinkedField",
        "name": "deleteOrganization",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "OrganizationGraphDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteOrganizationPayload",
        "kind": "LinkedField",
        "name": "deleteOrganization",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedOrganizationId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0f8180f1b546e4e232443869b04cfd36",
    "id": null,
    "metadata": {},
    "name": "OrganizationGraphDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation OrganizationGraphDeleteMutation(\n  $input: DeleteOrganizationInput!\n) {\n  deleteOrganization(input: $input) {\n    deletedOrganizationId\n  }\n}\n"
  }
};
})();

(node as any).hash = "9cd2bd6602e261d2728652849d134c71";

export default node;
