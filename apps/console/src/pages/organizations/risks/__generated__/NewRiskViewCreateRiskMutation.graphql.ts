/**
 * @generated SignedSource<<c3a526641ca53f4ef760eacadc5c3685>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateRiskInput = {
  description: string;
  name: string;
  organizationId: string;
};
export type NewRiskViewCreateRiskMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateRiskInput;
};
export type NewRiskViewCreateRiskMutation$data = {
  readonly createRisk: {
    readonly riskEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly updatedAt: string;
      };
    };
  };
};
export type NewRiskViewCreateRiskMutation = {
  response: NewRiskViewCreateRiskMutation$data;
  variables: NewRiskViewCreateRiskMutation$variables;
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
  "concreteType": "RiskEdge",
  "kind": "LinkedField",
  "name": "riskEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Risk",
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
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
    "name": "NewRiskViewCreateRiskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateRiskPayload",
        "kind": "LinkedField",
        "name": "createRisk",
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
    "name": "NewRiskViewCreateRiskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateRiskPayload",
        "kind": "LinkedField",
        "name": "createRisk",
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
            "name": "riskEdge",
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
    "cacheID": "ce3ac503734a6f0eb26f88813ed02858",
    "id": null,
    "metadata": {},
    "name": "NewRiskViewCreateRiskMutation",
    "operationKind": "mutation",
    "text": "mutation NewRiskViewCreateRiskMutation(\n  $input: CreateRiskInput!\n) {\n  createRisk(input: $input) {\n    riskEdge {\n      node {\n        id\n        name\n        description\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c0d8d1f046ed41c7a429c54b32358d3f";

export default node;
