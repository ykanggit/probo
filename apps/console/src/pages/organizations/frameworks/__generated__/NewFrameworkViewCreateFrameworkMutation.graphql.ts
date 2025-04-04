/**
 * @generated SignedSource<<88977ec320d7f163cf378446f9eb7f6a>>
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
export type NewFrameworkViewCreateFrameworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateFrameworkInput;
};
export type NewFrameworkViewCreateFrameworkMutation$data = {
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
export type NewFrameworkViewCreateFrameworkMutation = {
  response: NewFrameworkViewCreateFrameworkMutation$data;
  variables: NewFrameworkViewCreateFrameworkMutation$variables;
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
    "name": "NewFrameworkViewCreateFrameworkMutation",
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
    "name": "NewFrameworkViewCreateFrameworkMutation",
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
    "cacheID": "5b039fa77c4cfe00ce1001680520d9a9",
    "id": null,
    "metadata": {},
    "name": "NewFrameworkViewCreateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation NewFrameworkViewCreateFrameworkMutation(\n  $input: CreateFrameworkInput!\n) {\n  createFramework(input: $input) {\n    frameworkEdge {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "acf050994ea381c40d642a8d21e5bf98";

export default node;
