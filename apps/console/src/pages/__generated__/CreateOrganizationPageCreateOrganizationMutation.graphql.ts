/**
 * @generated SignedSource<<75687d4b60d4ae79658fffb99ea6f52b>>
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
export type CreateOrganizationPageCreateOrganizationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateOrganizationInput;
};
export type CreateOrganizationPageCreateOrganizationMutation$data = {
  readonly createOrganization: {
    readonly organizationEdge: {
      readonly node: {
        readonly id: string;
        readonly logoUrl: string;
        readonly name: string;
      };
    };
  };
};
export type CreateOrganizationPageCreateOrganizationMutation = {
  response: CreateOrganizationPageCreateOrganizationMutation$data;
  variables: CreateOrganizationPageCreateOrganizationMutation$variables;
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
    "name": "CreateOrganizationPageCreateOrganizationMutation",
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
    "name": "CreateOrganizationPageCreateOrganizationMutation",
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
    "cacheID": "aa445272c59c25a9a2edc7592c1fd7cc",
    "id": null,
    "metadata": {},
    "name": "CreateOrganizationPageCreateOrganizationMutation",
    "operationKind": "mutation",
    "text": "mutation CreateOrganizationPageCreateOrganizationMutation(\n  $input: CreateOrganizationInput!\n) {\n  createOrganization(input: $input) {\n    organizationEdge {\n      node {\n        id\n        name\n        logoUrl\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ec0da70244afe2faa02b05ee418b829e";

export default node;
