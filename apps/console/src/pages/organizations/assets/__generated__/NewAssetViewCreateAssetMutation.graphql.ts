/**
 * @generated SignedSource<<d3201cc709c2b7c947f4875520fb8960>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AssetType = "PHYSICAL" | "VIRTUAL";
export type CriticityLevel = "HIGH" | "LOW" | "MEDIUM";
export type CreateAssetInput = {
  amount: number;
  assetType: AssetType;
  criticity?: CriticityLevel;
  dataTypesStored: string;
  name: string;
  organizationId: string;
  ownerId: string;
  vendorIds?: ReadonlyArray<string> | null | undefined;
};
export type NewAssetViewCreateAssetMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateAssetInput;
};
export type NewAssetViewCreateAssetMutation$data = {
  readonly createAsset: {
    readonly assetEdge: {
      readonly node: {
        readonly amount: number;
        readonly assetType: AssetType;
        readonly criticity: CriticityLevel;
        readonly dataTypesStored: string;
        readonly id: string;
        readonly owner: {
          readonly fullName: string;
          readonly id: string;
        };
        readonly vendors: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly id: string;
              readonly name: string;
            };
          }>;
        };
      };
    };
  };
};
export type NewAssetViewCreateAssetMutation = {
  response: NewAssetViewCreateAssetMutation$data;
  variables: NewAssetViewCreateAssetMutation$variables;
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "AssetEdge",
  "kind": "LinkedField",
  "name": "assetEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Asset",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "amount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "criticity",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "assetType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "dataTypesStored",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "People",
          "kind": "LinkedField",
          "name": "owner",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "fullName",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "VendorConnection",
          "kind": "LinkedField",
          "name": "vendors",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "VendorEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Vendor",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v3/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
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
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewAssetViewCreateAssetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateAssetPayload",
        "kind": "LinkedField",
        "name": "createAsset",
        "plural": false,
        "selections": [
          (v4/*: any*/)
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
    "name": "NewAssetViewCreateAssetMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateAssetPayload",
        "kind": "LinkedField",
        "name": "createAsset",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "assetEdge",
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
    "cacheID": "2c2aaa87fd4a17b47fb6207c9be861b5",
    "id": null,
    "metadata": {},
    "name": "NewAssetViewCreateAssetMutation",
    "operationKind": "mutation",
    "text": "mutation NewAssetViewCreateAssetMutation(\n  $input: CreateAssetInput!\n) {\n  createAsset(input: $input) {\n    assetEdge {\n      node {\n        id\n        amount\n        criticity\n        assetType\n        dataTypesStored\n        owner {\n          id\n          fullName\n        }\n        vendors {\n          edges {\n            node {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "56f34aeeaca0d8165b8145c83b30fe67";

export default node;
