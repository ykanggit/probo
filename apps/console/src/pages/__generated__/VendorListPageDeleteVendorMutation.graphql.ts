/**
 * @generated SignedSource<<b97adcd0ae4816dc772fcbf3b3c6b3d7>>
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
  input: DeleteVendorInput;
};
export type VendorListPageDeleteVendorMutation$data = {
  readonly deleteVendor: any;
};
export type VendorListPageDeleteVendorMutation = {
  response: VendorListPageDeleteVendorMutation$data;
  variables: VendorListPageDeleteVendorMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "kind": "ScalarField",
    "name": "deleteVendor",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorListPageDeleteVendorMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorListPageDeleteVendorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6b9ec06210106cc8f8905fbfda5c60b0",
    "id": null,
    "metadata": {},
    "name": "VendorListPageDeleteVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListPageDeleteVendorMutation(\n  $input: DeleteVendorInput!\n) {\n  deleteVendor(input: $input)\n}\n"
  }
};
})();

(node as any).hash = "a435b00067d595fc8a1dec393ed1d0b6";

export default node;
