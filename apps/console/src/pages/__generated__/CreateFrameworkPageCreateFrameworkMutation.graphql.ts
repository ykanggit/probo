/**
 * @generated SignedSource<<9c88cb0bf2c3491784bdea7e46c918a3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateFrameworkInput = {
  description: string;
  name: string;
  organizationId: string;
};
export type CreateFrameworkPageCreateFrameworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateFrameworkInput;
};
export type CreateFrameworkPageCreateFrameworkMutation$data = {
  readonly createFramework: {
    readonly frameworkEdge: {
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly name: string;
      };
    };
  };
};
export type CreateFrameworkPageCreateFrameworkMutation = {
  response: CreateFrameworkPageCreateFrameworkMutation$data;
  variables: CreateFrameworkPageCreateFrameworkMutation$variables;
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
  "concreteType": "FrameworkEdge",
  "kind": "LinkedField",
  "name": "frameworkEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Framework",
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
    "name": "CreateFrameworkPageCreateFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateFrameworkPayload",
        "kind": "LinkedField",
        "name": "createFramework",
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
    "name": "CreateFrameworkPageCreateFrameworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateFrameworkPayload",
        "kind": "LinkedField",
        "name": "createFramework",
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
            "name": "frameworkEdge",
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
    "cacheID": "142ffd990da914bddaa2752dfff0faaf",
    "id": null,
    "metadata": {},
    "name": "CreateFrameworkPageCreateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation CreateFrameworkPageCreateFrameworkMutation(\n  $input: CreateFrameworkInput!\n) {\n  createFramework(input: $input) {\n    frameworkEdge {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "60b83b4b5302f15a8e6f6b711c905963";

export default node;
