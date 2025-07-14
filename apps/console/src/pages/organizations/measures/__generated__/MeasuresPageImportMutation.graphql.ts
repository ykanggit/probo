/**
 * @generated SignedSource<<0e8ac685aa34bee03c7055b1c5d8cec3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MeasureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type TaskState = "DONE" | "TODO";
export type ImportMeasureInput = {
  file: any;
  organizationId: string;
};
export type MeasuresPageImportMutation$variables = {
  connections: ReadonlyArray<string>;
  input: ImportMeasureInput;
  taskConnections: ReadonlyArray<string>;
};
export type MeasuresPageImportMutation$data = {
  readonly importMeasure: {
    readonly measureEdges: ReadonlyArray<{
      readonly node: {
        readonly category: string;
        readonly id: string;
        readonly name: string;
        readonly state: MeasureState;
      };
    }>;
    readonly taskEdges: ReadonlyArray<{
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly measure: {
          readonly id: string;
        } | null | undefined;
        readonly name: string;
        readonly state: TaskState;
      };
    }>;
  };
};
export type MeasuresPageImportMutation = {
  response: MeasuresPageImportMutation$data;
  variables: MeasuresPageImportMutation$variables;
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
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "taskConnections"
},
v3 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "MeasureEdge",
  "kind": "LinkedField",
  "name": "measureEdges",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Measure",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v5/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "category",
          "storageKey": null
        },
        (v6/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "TaskEdge",
  "kind": "LinkedField",
  "name": "taskEdges",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Task",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v5/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        (v6/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Measure",
          "kind": "LinkedField",
          "name": "measure",
          "plural": false,
          "selections": [
            (v4/*: any*/)
          ],
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
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MeasuresPageImportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ImportMeasurePayload",
        "kind": "LinkedField",
        "name": "importMeasure",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v8/*: any*/)
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
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "MeasuresPageImportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ImportMeasurePayload",
        "kind": "LinkedField",
        "name": "importMeasure",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "measureEdges",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          },
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "taskEdges",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "taskConnections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "35630778ab0e75d326d98667dfdcdef0",
    "id": null,
    "metadata": {},
    "name": "MeasuresPageImportMutation",
    "operationKind": "mutation",
    "text": "mutation MeasuresPageImportMutation(\n  $input: ImportMeasureInput!\n) {\n  importMeasure(input: $input) {\n    measureEdges {\n      node {\n        id\n        name\n        category\n        state\n      }\n    }\n    taskEdges {\n      node {\n        id\n        name\n        description\n        state\n        measure {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6dfae22584951c4380072f6fc5baf265";

export default node;
