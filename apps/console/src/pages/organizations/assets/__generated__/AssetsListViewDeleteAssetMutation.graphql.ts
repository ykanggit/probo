/**
 * @generated SignedSource<<e56af42bed63f99011e9565c0364ea0c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteAssetInput = {
  assetId: string;
};
export type AssetsListViewDeleteAssetMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteAssetInput;
};
export type AssetsListViewDeleteAssetMutation$data = {
  readonly deleteAsset: {
    readonly deletedAssetId: string;
  };
};
export type AssetsListViewDeleteAssetMutation = {
  response: AssetsListViewDeleteAssetMutation$data;
  variables: AssetsListViewDeleteAssetMutation$variables;
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
  "name": "deletedAssetId",
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
    "name": "AssetsListViewDeleteAssetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteAssetPayload",
        "kind": "LinkedField",
        "name": "deleteAsset",
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
    "name": "AssetsListViewDeleteAssetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteAssetPayload",
        "kind": "LinkedField",
        "name": "deleteAsset",
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
            "name": "deletedAssetId",
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
    "cacheID": "d7987550f982b36de3911f3e7c8e9677",
    "id": null,
    "metadata": {},
    "name": "AssetsListViewDeleteAssetMutation",
    "operationKind": "mutation",
    "text": "mutation AssetsListViewDeleteAssetMutation(\n  $input: DeleteAssetInput!\n) {\n  deleteAsset(input: $input) {\n    deletedAssetId\n  }\n}\n"
  }
};
})();

(node as any).hash = "3f576871aa0d4495afcca5ecaf1aefca";

export default node;
