/**
 * @generated SignedSource<<4f3bd0ac276b53f926e31581f4e00150>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteMeasureInput = {
  measureId: string;
};
export type MeasureGraphDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteMeasureInput;
  taskConnections: ReadonlyArray<string>;
};
export type MeasureGraphDeleteMutation$data = {
  readonly deleteMeasure: {
    readonly deletedMeasureId: string;
    readonly deletedTaskIds: ReadonlyArray<string>;
  };
};
export type MeasureGraphDeleteMutation = {
  response: MeasureGraphDeleteMutation$data;
  variables: MeasureGraphDeleteMutation$variables;
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
  "name": "deletedMeasureId",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedTaskIds",
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
    "name": "MeasureGraphDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "DeleteMeasurePayload",
        "kind": "LinkedField",
        "name": "deleteMeasure",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/)
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
    "name": "MeasureGraphDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "DeleteMeasurePayload",
        "kind": "LinkedField",
        "name": "deleteMeasure",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedMeasureId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          },
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedTaskIds",
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
    "cacheID": "ecc74e1c35ad3b93a9e444586c4f4a66",
    "id": null,
    "metadata": {},
    "name": "MeasureGraphDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation MeasureGraphDeleteMutation(\n  $input: DeleteMeasureInput!\n) {\n  deleteMeasure(input: $input) {\n    deletedMeasureId\n    deletedTaskIds\n  }\n}\n"
  }
};
})();

(node as any).hash = "9a26107a14d76890720663ddd8e8f622";

export default node;
