/**
 * @generated SignedSource<<615df626961da33fb1e48249870eefe1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteFrameworkInput = {
  frameworkId: string;
};
export type FrameworkLayoutViewDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteFrameworkInput;
};
export type FrameworkLayoutViewDeleteMutation$data = {
  readonly deleteFramework: {
    readonly deletedFrameworkId: string;
  };
};
export type FrameworkLayoutViewDeleteMutation = {
  response: FrameworkLayoutViewDeleteMutation$data;
  variables: FrameworkLayoutViewDeleteMutation$variables;
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
  "name": "deletedFrameworkId",
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
    "name": "FrameworkLayoutViewDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteFrameworkPayload",
        "kind": "LinkedField",
        "name": "deleteFramework",
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
    "name": "FrameworkLayoutViewDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteFrameworkPayload",
        "kind": "LinkedField",
        "name": "deleteFramework",
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
            "name": "deletedFrameworkId",
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
    "cacheID": "bf9a90fe1038778a5bc29ea20e8b07b9",
    "id": null,
    "metadata": {},
    "name": "FrameworkLayoutViewDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkLayoutViewDeleteMutation(\n  $input: DeleteFrameworkInput!\n) {\n  deleteFramework(input: $input) {\n    deletedFrameworkId\n  }\n}\n"
  }
};
})();

(node as any).hash = "52564100dcf31f83cabd0683a616982c";

export default node;
