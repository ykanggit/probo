/**
 * @generated SignedSource<<c376281753e99a7cada0872375288f35>>
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
export type ListVendorViewDeleteVendorMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteVendorInput;
};
export type ListVendorViewDeleteVendorMutation$data = {
  readonly deleteVendor: {
    readonly deletedVendorId: string;
  };
};
export type ListVendorViewDeleteVendorMutation = {
  response: ListVendorViewDeleteVendorMutation$data;
  variables: ListVendorViewDeleteVendorMutation$variables;
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
    "name": "ListVendorViewDeleteVendorMutation",
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
    "name": "ListVendorViewDeleteVendorMutation",
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
    "cacheID": "7aa26c31ccb2b601700560ad66e84b6f",
    "id": null,
    "metadata": {},
    "name": "ListVendorViewDeleteVendorMutation",
    "operationKind": "mutation",
    "text": "mutation ListVendorViewDeleteVendorMutation(\n  $input: DeleteVendorInput!\n) {\n  deleteVendor(input: $input) {\n    deletedVendorId\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d443dea5c3e78e04dbfc6632b063c8d";

export default node;
