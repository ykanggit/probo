/**
 * @generated SignedSource<<a46552774a4d24ce7d1849d7485fb323>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteVendorInput = {
  vendorId: string;
};
export type VendorListViewDeleteVendorMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteVendorInput;
};
export type VendorListViewDeleteVendorMutation$data = {
  readonly deleteVendor: {
    readonly deletedVendorId: string;
  };
};
export type VendorListViewDeleteVendorMutation = {
  response: VendorListViewDeleteVendorMutation$data;
  variables: VendorListViewDeleteVendorMutation$variables;
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
  "name": "deletedVendorId",
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
    "name": "VendorListViewDeleteVendorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteVendorPayload",
        "kind": "LinkedField",
        "name": "deleteVendor",
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
    "name": "VendorListViewDeleteVendorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteVendorPayload",
        "kind": "LinkedField",
        "name": "deleteVendor",
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
            "name": "deletedVendorId",
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
    "cacheID": "7edee61297200dec1695f6b2325cd7f0",
    "id": null,
    "metadata": {},
    "name": "VendorListViewDeleteVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListViewDeleteVendorMutation(\n  $input: DeleteVendorInput!\n) {\n  deleteVendor(input: $input) {\n    deletedVendorId\n  }\n}\n"
  }
};
})();

(node as any).hash = "85387685fd75c8b99fb9e9195d4a903f";

export default node;
