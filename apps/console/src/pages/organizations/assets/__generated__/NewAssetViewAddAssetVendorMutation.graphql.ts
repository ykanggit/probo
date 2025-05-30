/**
 * @generated SignedSource<<29c3688b6280f97bc3713b4e107f012a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AddAssetVendorInput = {
  assetId: string;
  vendorId: string;
};
export type NewAssetViewAddAssetVendorMutation$variables = {
  input: AddAssetVendorInput;
};
export type NewAssetViewAddAssetVendorMutation$data = {
  readonly addAssetVendor: {
    readonly asset: {
      readonly id: string;
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
export type NewAssetViewAddAssetVendorMutation = {
  response: NewAssetViewAddAssetVendorMutation$data;
  variables: NewAssetViewAddAssetVendorMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AddAssetVendorPayload",
    "kind": "LinkedField",
    "name": "addAssetVendor",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Asset",
        "kind": "LinkedField",
        "name": "asset",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
                      (v1/*: any*/),
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "NewAssetViewAddAssetVendorMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "NewAssetViewAddAssetVendorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "5e1ee36fdf08abfcfc75ffe7e9f6f81f",
    "id": null,
    "metadata": {},
    "name": "NewAssetViewAddAssetVendorMutation",
    "operationKind": "mutation",
    "text": "mutation NewAssetViewAddAssetVendorMutation(\n  $input: AddAssetVendorInput!\n) {\n  addAssetVendor(input: $input) {\n    asset {\n      id\n      vendors {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "856e34e5fb3ca94b3cc38fe7edca156d";

export default node;
