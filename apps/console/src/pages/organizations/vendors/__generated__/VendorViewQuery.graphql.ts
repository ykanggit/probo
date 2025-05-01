/**
 * @generated SignedSource<<2a33eeb4651f6afe0a8f06f44c0f2711>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type BusinessImpact = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM";
export type DataSensitivity = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "NONE";
export type VendorViewQuery$variables = {
  organizationId: string;
  vendorId: string;
};
export type VendorViewQuery$data = {
  readonly node: {
    readonly businessOwner?: {
      readonly fullName: string;
      readonly id: string;
    } | null | undefined;
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
    readonly riskAssessments?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly assessedAt: string;
          readonly assessedBy: {
            readonly fullName: string;
            readonly id: string;
          };
          readonly businessImpact: BusinessImpact;
          readonly createdAt: string;
          readonly dataSensitivity: DataSensitivity;
          readonly expiresAt: string;
          readonly id: string;
          readonly notes: string | null | undefined;
        };
      }>;
    };
    readonly securityOwner?: {
      readonly fullName: string;
      readonly id: string;
    } | null | undefined;
    readonly securityPageUrl?: string | null | undefined;
    readonly serviceLevelAgreementUrl?: string | null | undefined;
    readonly statusPageUrl?: string | null | undefined;
    readonly termsOfServiceUrl?: string | null | undefined;
    readonly trustPageUrl?: string | null | undefined;
    readonly updatedAt?: string;
    readonly websiteUrl?: string | null | undefined;
  };
  readonly organization: {
    readonly " $fragmentSpreads": FragmentRefs<"PeopleSelector_organization">;
  };
  readonly viewer: {
    readonly user: {
      readonly people: {
        readonly id: string;
      } | null | undefined;
    };
  };
};
export type VendorViewQuery = {
  response: VendorViewQuery$data;
  variables: VendorViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "vendorId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "vendorId"
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
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "statusPageUrl",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "termsOfServiceUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "privacyPolicyUrl",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "serviceLevelAgreementUrl",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dataProcessingAgreementUrl",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "securityPageUrl",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trustPageUrl",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "certifications",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "headquarterAddress",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "legalName",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "websiteUrl",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v18 = [
  (v3/*: any*/),
  (v17/*: any*/)
],
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "businessOwner",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "securityOwner",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v25 = {
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
},
v26 = [
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
          (v3/*: any*/),
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
          (v21/*: any*/),
          (v23/*: any*/)
        ],
        "storageKey": null
      },
      (v24/*: any*/)
    ],
    "storageKey": null
  },
  (v25/*: any*/)
],
v27 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "VendorRiskAssessmentEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "VendorRiskAssessment",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "assessedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expiresAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "dataSensitivity",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "businessImpact",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "notes",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "assessedBy",
            "plural": false,
            "selections": (v18/*: any*/),
            "storageKey": null
          },
          (v21/*: any*/),
          (v23/*: any*/)
        ],
        "storageKey": null
      },
      (v24/*: any*/)
    ],
    "storageKey": null
  },
  (v25/*: any*/)
],
v28 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "organizationId"
  }
],
v29 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "organizationId",
      "variableName": "organizationId"
    }
  ],
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "people",
  "plural": false,
  "selections": [
    (v3/*: any*/)
  ],
  "storageKey": null
},
v30 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v31 = [
  (v30/*: any*/)
],
v32 = [
  (v30/*: any*/),
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": {
      "direction": "ASC",
      "field": "FULL_NAME"
    }
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "VendorViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
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
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              {
                "alias": "complianceReports",
                "args": null,
                "concreteType": "VendorComplianceReportConnection",
                "kind": "LinkedField",
                "name": "__VendorView_complianceReports_connection",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              {
                "alias": "riskAssessments",
                "args": null,
                "concreteType": "VendorRiskAssessmentConnection",
                "kind": "LinkedField",
                "name": "__VendorView_riskAssessments_connection",
                "plural": false,
                "selections": (v27/*: any*/),
                "storageKey": null
              }
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "organization",
        "args": (v28/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PeopleSelector_organization"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v29/*: any*/)
            ],
            "storageKey": null
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "VendorViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v23/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
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
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              {
                "alias": null,
                "args": (v31/*: any*/),
                "concreteType": "VendorComplianceReportConnection",
                "kind": "LinkedField",
                "name": "complianceReports",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": "complianceReports(first:100)"
              },
              {
                "alias": null,
                "args": (v31/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "VendorView_complianceReports",
                "kind": "LinkedHandle",
                "name": "complianceReports"
              },
              {
                "alias": null,
                "args": (v31/*: any*/),
                "concreteType": "VendorRiskAssessmentConnection",
                "kind": "LinkedField",
                "name": "riskAssessments",
                "plural": false,
                "selections": (v27/*: any*/),
                "storageKey": "riskAssessments(first:100)"
              },
              {
                "alias": null,
                "args": (v31/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "VendorView_riskAssessments",
                "kind": "LinkedHandle",
                "name": "riskAssessments"
              }
            ],
            "type": "Vendor",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": "organization",
        "args": (v28/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v23/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v32/*: any*/),
                "concreteType": "PeopleConnection",
                "kind": "LinkedField",
                "name": "peoples",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PeopleEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "People",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "primaryEmailAddress",
                            "storageKey": null
                          },
                          (v23/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v24/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v25/*: any*/)
                ],
                "storageKey": "peoples(first:100,orderBy:{\"direction\":\"ASC\",\"field\":\"FULL_NAME\"})"
              },
              {
                "alias": null,
                "args": (v32/*: any*/),
                "filters": [
                  "orderBy"
                ],
                "handle": "connection",
                "key": "PeopleSelector_organization_peoples",
                "kind": "LinkedHandle",
                "name": "peoples"
              }
            ],
            "type": "Organization",
            "abstractKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v29/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d80a66271806001a76348db9398ae760",
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
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "riskAssessments"
          ]
        }
      ]
    },
    "name": "VendorViewQuery",
    "operationKind": "query",
    "text": "query VendorViewQuery(\n  $vendorId: ID!\n  $organizationId: ID!\n) {\n  node(id: $vendorId) {\n    __typename\n    ... on Vendor {\n      id\n      name\n      description\n      statusPageUrl\n      termsOfServiceUrl\n      privacyPolicyUrl\n      serviceLevelAgreementUrl\n      dataProcessingAgreementUrl\n      securityPageUrl\n      trustPageUrl\n      certifications\n      headquarterAddress\n      legalName\n      websiteUrl\n      businessOwner {\n        id\n        fullName\n      }\n      securityOwner {\n        id\n        fullName\n      }\n      createdAt\n      updatedAt\n      complianceReports(first: 100) {\n        edges {\n          node {\n            id\n            reportName\n            reportDate\n            validUntil\n            fileUrl\n            fileSize\n            createdAt\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      riskAssessments(first: 100) {\n        edges {\n          node {\n            id\n            assessedAt\n            expiresAt\n            dataSensitivity\n            businessImpact\n            notes\n            assessedBy {\n              id\n              fullName\n            }\n            createdAt\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n    id\n  }\n  organization: node(id: $organizationId) {\n    __typename\n    ...PeopleSelector_organization\n    id\n  }\n  viewer {\n    user {\n      people(organizationId: $organizationId) {\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment PeopleSelector_organization on Organization {\n  id\n  peoples(first: 100, orderBy: {direction: ASC, field: FULL_NAME}) {\n    edges {\n      node {\n        id\n        fullName\n        primaryEmailAddress\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "97cacb4f4410588114fc82abc78d9140";

export default node;
