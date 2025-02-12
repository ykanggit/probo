/**
 * @generated SignedSource<<c905d68569a5158d7e5a0ee5eb600a2b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateVendorInput = {
  name: string;
  organizationId: string;
};
export type VendorListPageCreateVendorMutation$variables = {
  input: CreateVendorInput;
};
export type VendorListPageCreateVendorMutation$data = {
  readonly createVendor: {
    readonly createdAt: any;
    readonly id: string;
    readonly name: string;
    readonly updatedAt: any;
  };
};
export type VendorListPageCreateVendorMutation = {
  response: VendorListPageCreateVendorMutation$data;
  variables: VendorListPageCreateVendorMutation$variables;
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
    "concreteType": "Vendor",
    "kind": "LinkedField",
    "name": "createVendor",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
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
    "name": "VendorListPageCreateVendorMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorListPageCreateVendorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "11eabcf8c7c1fef7b2cb37bcadf52666",
    "id": null,
    "metadata": {},
    "name": "VendorListPageCreateVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorListPageCreateVendorMutation(\n  $input: CreateVendorInput!\n) {\n  createVendor(input: $input) {\n    id\n    name\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "aeb5751c0d301a9433e706d237a025cd";

export default node;
