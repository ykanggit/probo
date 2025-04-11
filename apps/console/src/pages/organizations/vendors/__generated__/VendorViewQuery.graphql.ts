/**
 * @generated SignedSource<<f69485d1f583f57e60850e2bc6428763>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTier = "CRITICAL" | "GENERAL" | "SIGNIFICANT";
export type ServiceCriticality = "HIGH" | "LOW" | "MEDIUM";
export type VendorViewQuery$variables = {
  vendorId: string;
};
export type VendorViewQuery$data = {
  readonly node: {
    readonly certifications?: ReadonlyArray<string>;
    readonly complianceReports?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly createdAt: string;
          readonly fileSize: number;
          readonly fileUrl: string;
          readonly id: string;
          readonly reportDate: string;
          readonly reportName: string;
          readonly validUntil: string | null | undefined;
        };
      }>;
    };
    readonly createdAt?: string;
    readonly dataProcessingAgreementUrl?: string | null | undefined;
    readonly description?: string | null | undefined;
    readonly headquarterAddress?: string | null | undefined;
    readonly id?: string;
    readonly legalName?: string | null | undefined;
    readonly name?: string;
    readonly privacyPolicyUrl?: string | null | undefined;
    readonly riskTier?: RiskTier;
    readonly securityPageUrl?: string | null | undefined;
    readonly serviceCriticality?: ServiceCriticality;
    readonly serviceLevelAgreementUrl?: string | null | undefined;
    readonly serviceStartAt?: string;
    readonly serviceTerminationAt?: string | null | undefined;
    readonly statusPageUrl?: string | null | undefined;
    readonly termsOfServiceUrl?: string | null | undefined;
    readonly trustPageUrl?: string | null | undefined;
    readonly updatedAt?: string;
    readonly websiteUrl?: string | null | undefined;
  };
};
export type VendorViewQuery = {
  response: VendorViewQuery$data;
  variables: VendorViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "vendorId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "vendorId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceStartAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceTerminationAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceCriticality",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "riskTier",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "statusPageUrl",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "termsOfServiceUrl",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privacyPolicyUrl",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceLevelAgreementUrl",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dataProcessingAgreementUrl",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "securityPageUrl",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trustPageUrl",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "certifications",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headquarterAddress",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "legalName",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "websiteUrl",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v23 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "VendorComplianceReportEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "VendorComplianceReport",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
          (v20/*: any*/),
          (v22/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v24 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              {
                "alias": "complianceReports",
                "args": null,
                "concreteType": "VendorComplianceReportConnection",
                "kind": "LinkedField",
                "name": "__VendorView_complianceReports_connection",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              }
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v22/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              {
                "alias": null,
                "args": (v24/*: any*/),
                "concreteType": "VendorComplianceReportConnection",
                "kind": "LinkedField",
                "name": "complianceReports",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": "complianceReports(first:100)"
              },
              {
                "alias": null,
                "args": (v24/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "VendorView_complianceReports",
                "kind": "LinkedHandle",
                "name": "complianceReports"
              }
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2bef9911b76d74ced85cf4430410a297",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "complianceReports"
          ]
        }
      ]
    },
    "name": "VendorViewQuery",
    "operationKind": "query",
    "text": "query VendorViewQuery(\n  $vendorId: ID!\n) {\n  node(id: $vendorId) {\n    __typename\n    ... on Vendor {\n      id\n      name\n      description\n      serviceStartAt\n      serviceTerminationAt\n      serviceCriticality\n      riskTier\n      statusPageUrl\n      termsOfServiceUrl\n      privacyPolicyUrl\n      serviceLevelAgreementUrl\n      dataProcessingAgreementUrl\n      securityPageUrl\n      trustPageUrl\n      certifications\n      headquarterAddress\n      legalName\n      websiteUrl\n      createdAt\n      updatedAt\n      complianceReports(first: 100) {\n        edges {\n          node {\n            id\n            reportName\n            reportDate\n            validUntil\n            fileUrl\n            fileSize\n            createdAt\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "f3f95bc0c893b61e83940c1cc0c33922";

export default node;
