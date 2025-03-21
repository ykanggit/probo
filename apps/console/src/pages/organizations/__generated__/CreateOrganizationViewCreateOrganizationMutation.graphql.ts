/**
 * @generated SignedSource<<d5934a25e82e73935b121d9f456b41d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateOrganizationInput = {
  name: string;
};
export type CreateOrganizationViewCreateOrganizationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateOrganizationInput;
};
export type CreateOrganizationViewCreateOrganizationMutation$data = {
  readonly createOrganization: {
    readonly organizationEdge: {
      readonly node: {
        readonly id: string;
        readonly logoUrl: string | null | undefined;
        readonly name: string;
      };
    };
  };
};
export type CreateOrganizationViewCreateOrganizationMutation = {
  response: CreateOrganizationViewCreateOrganizationMutation$data;
  variables: CreateOrganizationViewCreateOrganizationMutation$variables;
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
  "concreteType": "OrganizationEdge",
  "kind": "LinkedField",
  "name": "organizationEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Organization",
      "kind": "LinkedField",
      "name": "node",
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateOrganizationViewCreateOrganizationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateOrganizationPayload",
        "kind": "LinkedField",
        "name": "createOrganization",
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
    "name": "CreateOrganizationViewCreateOrganizationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateOrganizationPayload",
        "kind": "LinkedField",
        "name": "createOrganization",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "organizationEdge",
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
    "cacheID": "867788ffb7d7d5f42d86fc0b42e91d8f",
    "id": null,
    "metadata": {},
    "name": "CreateOrganizationViewCreateOrganizationMutation",
    "operationKind": "mutation",
    "text": "mutation CreateOrganizationViewCreateOrganizationMutation(\n  $input: CreateOrganizationInput!\n) {\n  createOrganization(input: $input) {\n    organizationEdge {\n      node {\n        id\n        name\n        logoUrl\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "999f210db4fc65cbad47472294d9cf46";

export default node;
