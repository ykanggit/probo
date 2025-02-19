/**
 * @generated SignedSource<<ff037e64f503f247a68922f86248bb10>>
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
export type VendorListPageDeleteVendorMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteVendorInput;
};
export type VendorListPageDeleteVendorMutation$data = {
  readonly deleteVendor: {
    readonly deletedVendorId: string;
  };
};
export type VendorListPageDeleteVendorMutation = {
  response: VendorListPageDeleteVendorMutation$data;
  variables: VendorListPageDeleteVendorMutation$variables;
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
    "name": "VendorListPageDeleteVendorMutation",
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
    "name": "VendorListPageDeleteVendorMutation",
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
    "cacheID": "278e42c6c988a64d4c863198f02df901",
    "id": null,
    "metadata": {},
    "name": "VendorListPageDeleteVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListPageDeleteVendorMutation(\n  $input: DeleteVendorInput!\n) {\n  deleteVendor(input: $input) {\n    deletedVendorId\n  }\n}\n"
  }
};
})();

(node as any).hash = "20a320191535706246ae00aa05df991e";

export default node;
