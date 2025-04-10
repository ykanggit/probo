/**
 * @generated SignedSource<<2bcb17bf1104688db87ac4927bc4c0c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UploadVendorComplianceReportInput = {
  file: any;
  reportDate: string;
  reportName: string;
  validUntil?: string | null | undefined;
  vendorId: string;
};
export type VendorViewUploadComplianceReportMutation$variables = {
  connections: ReadonlyArray<string>;
  input: UploadVendorComplianceReportInput;
};
export type VendorViewUploadComplianceReportMutation$data = {
  readonly uploadVendorComplianceReport: {
    readonly vendorComplianceReportEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly fileSize: number;
        readonly fileUrl: string;
        readonly id: string;
        readonly reportDate: string;
        readonly reportName: string;
        readonly validUntil: string | null | undefined;
      };
    };
  };
};
export type VendorViewUploadComplianceReportMutation = {
  response: VendorViewUploadComplianceReportMutation$data;
  variables: VendorViewUploadComplianceReportMutation$variables;
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
  "concreteType": "VendorComplianceReportEdge",
  "kind": "LinkedField",
  "name": "vendorComplianceReportEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "VendorComplianceReport",
      "kind": "LinkedField",
      "name": "node",
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
          "name": "reportName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "reportDate",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "validUntil",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fileUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fileSize",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
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
    "name": "VendorViewUploadComplianceReportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadVendorComplianceReportPayload",
        "kind": "LinkedField",
        "name": "uploadVendorComplianceReport",
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
    "name": "VendorViewUploadComplianceReportMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadVendorComplianceReportPayload",
        "kind": "LinkedField",
        "name": "uploadVendorComplianceReport",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "vendorComplianceReportEdge",
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
    "cacheID": "6700bbabd4e074cc11d5dc7fa5485ea9",
    "id": null,
    "metadata": {},
    "name": "VendorViewUploadComplianceReportMutation",
    "operationKind": "mutation",
    "text": "mutation VendorViewUploadComplianceReportMutation(\n  $input: UploadVendorComplianceReportInput!\n) {\n  uploadVendorComplianceReport(input: $input) {\n    vendorComplianceReportEdge {\n      node {\n        id\n        reportName\n        reportDate\n        validUntil\n        fileUrl\n        fileSize\n        createdAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1952e347045e900536855a11b826b106";

export default node;
