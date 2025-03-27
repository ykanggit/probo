/**
 * @generated SignedSource<<9f35422e7d027485b106e6fb8879d460>>
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
export type FrameworkViewDeleteMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteFrameworkInput;
};
export type FrameworkViewDeleteMutation$data = {
  readonly deleteFramework: {
    readonly deletedFrameworkId: string;
  };
};
export type FrameworkViewDeleteMutation = {
  response: FrameworkViewDeleteMutation$data;
  variables: FrameworkViewDeleteMutation$variables;
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
    "name": "FrameworkViewDeleteMutation",
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
    "name": "FrameworkViewDeleteMutation",
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
    "cacheID": "b10bac4b295c5d2a9a564cbba4569633",
    "id": null,
    "metadata": {},
    "name": "FrameworkViewDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkViewDeleteMutation(\n  $input: DeleteFrameworkInput!\n) {\n  deleteFramework(input: $input) {\n    deletedFrameworkId\n  }\n}\n"
  }
};
})();

(node as any).hash = "8b20886821651ffb7e335df58fb46fc9";

export default node;
