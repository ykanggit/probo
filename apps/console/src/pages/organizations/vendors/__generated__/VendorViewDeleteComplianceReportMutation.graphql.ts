/**
 * @generated SignedSource<<a95a2943aea5d692a8f116bef3f91a6f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteVendorComplianceReportInput = {
  reportId: string;
};
export type VendorViewDeleteComplianceReportMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteVendorComplianceReportInput;
};
export type VendorViewDeleteComplianceReportMutation$data = {
  readonly deleteVendorComplianceReport: {
    readonly deletedVendorComplianceReportId: string;
  };
};
export type VendorViewDeleteComplianceReportMutation = {
  response: VendorViewDeleteComplianceReportMutation$data;
  variables: VendorViewDeleteComplianceReportMutation$variables;
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
  "name": "deletedVendorComplianceReportId",
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
    "name": "VendorViewDeleteComplianceReportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteVendorComplianceReportPayload",
        "kind": "LinkedField",
        "name": "deleteVendorComplianceReport",
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
    "name": "VendorViewDeleteComplianceReportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteVendorComplianceReportPayload",
        "kind": "LinkedField",
        "name": "deleteVendorComplianceReport",
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
            "name": "deletedVendorComplianceReportId",
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
    "cacheID": "1e41cb2debc83547d78f3dd77236230a",
    "id": null,
    "metadata": {},
    "name": "VendorViewDeleteComplianceReportMutation",
    "operationKind": "mutation",
    "text": "mutation VendorViewDeleteComplianceReportMutation(\n  $input: DeleteVendorComplianceReportInput!\n) {\n  deleteVendorComplianceReport(input: $input) {\n    deletedVendorComplianceReportId\n  }\n}\n"
  }
};
})();

(node as any).hash = "78d3becac99c6b6d1b65ebb116b0a172";

export default node;
