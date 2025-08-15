/**
 * @generated SignedSource<<fc4103e0e8b03c1b6b8ea07c4adcf095>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AuditState = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "OUTDATED" | "REJECTED";
export type AuditGraphNodeQuery$variables = {
  auditId: string;
};
export type AuditGraphNodeQuery$data = {
  readonly node: {
    readonly createdAt?: any;
    readonly framework?: {
      readonly id: string;
      readonly name: string;
    };
    readonly id?: string;
    readonly name?: string | null | undefined;
    readonly organization?: {
      readonly id: string;
      readonly name: string;
    };
    readonly report?: {
      readonly createdAt: any;
      readonly downloadUrl: string | null | undefined;
      readonly filename: string;
      readonly id: string;
      readonly mimeType: string;
      readonly size: number;
    } | null | undefined;
    readonly reportUrl?: string | null | undefined;
    readonly state?: AuditState;
    readonly updatedAt?: any;
    readonly validFrom?: any | null | undefined;
    readonly validUntil?: any | null | undefined;
  };
};
export type AuditGraphNodeQuery = {
  response: AuditGraphNodeQuery$data;
  variables: AuditGraphNodeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "auditId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "auditId"
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
  "name": "validFrom",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "validUntil",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Report",
  "kind": "LinkedField",
  "name": "report",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "filename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mimeType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "size",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "downloadUrl",
      "storageKey": null
    },
    (v6/*: any*/)
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reportUrl",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v10 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Framework",
  "kind": "LinkedField",
  "name": "framework",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Organization",
  "kind": "LinkedField",
  "name": "organization",
  "plural": false,
  "selections": (v10/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AuditGraphNodeQuery",
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
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v6/*: any*/),
              (v13/*: any*/)
            ],
            "type": "Audit",
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
    "name": "AuditGraphNodeQuery",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v6/*: any*/),
              (v13/*: any*/)
            ],
            "type": "Audit",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "eede00ab53ccd396e92b7fe6c1f1c2a2",
    "id": null,
    "metadata": {},
    "name": "AuditGraphNodeQuery",
    "operationKind": "query",
    "text": "query AuditGraphNodeQuery(\n  $auditId: ID!\n) {\n  node(id: $auditId) {\n    __typename\n    ... on Audit {\n      id\n      name\n      validFrom\n      validUntil\n      report {\n        id\n        filename\n        mimeType\n        size\n        downloadUrl\n        createdAt\n      }\n      reportUrl\n      state\n      framework {\n        id\n        name\n      }\n      organization {\n        id\n        name\n      }\n      createdAt\n      updatedAt\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "c07896ae39a7d16b42c7ee4216dc28fa";

export default node;
