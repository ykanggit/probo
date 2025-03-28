/**
 * @generated SignedSource<<56ffdc565a3b834423a8a704d0fa68dc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationImportance = "ADVANCED" | "MANDATORY" | "PREFERRED";
export type CreateMitigationInput = {
  category: string;
  description: string;
  importance: MitigationImportance;
  name: string;
  organizationId: string;
};
export type MitigationNewViewCreateMitigationMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateMitigationInput;
};
export type MitigationNewViewCreateMitigationMutation$data = {
  readonly createMitigation: {
    readonly mitigationEdge: {
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly name: string;
      };
    };
  };
};
export type MitigationNewViewCreateMitigationMutation = {
  response: MitigationNewViewCreateMitigationMutation$data;
  variables: MitigationNewViewCreateMitigationMutation$variables;
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
  "concreteType": "MitigationEdge",
  "kind": "LinkedField",
  "name": "mitigationEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Mitigation",
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
          "name": "description",
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
    "name": "MitigationNewViewCreateMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMitigationPayload",
        "kind": "LinkedField",
        "name": "createMitigation",
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
    "name": "MitigationNewViewCreateMitigationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateMitigationPayload",
        "kind": "LinkedField",
        "name": "createMitigation",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "mitigationEdge",
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
    "cacheID": "3e7544674c48e16ec6698e04f8b5fb5e",
    "id": null,
    "metadata": {},
    "name": "MitigationNewViewCreateMitigationMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationNewViewCreateMitigationMutation(\n  $input: CreateMitigationInput!\n) {\n  createMitigation(input: $input) {\n    mitigationEdge {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "32c38d7a04244e041fc6023efc010d7f";

export default node;
