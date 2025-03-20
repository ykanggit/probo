/**
 * @generated SignedSource<<6726ce2446381674b1992ece913fd680>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvidenceState = "EXPIRED" | "INVALID" | "VALID";
export type EvidenceType = "FILE" | "LINK";
export type UploadEvidenceInput = {
  description: string;
  file?: any | null | undefined;
  name: string;
  taskId: string;
  type: EvidenceType;
  url?: string | null | undefined;
};
export type ControlOverviewPageUploadEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: UploadEvidenceInput;
};
export type ControlOverviewPageUploadEvidenceMutation$data = {
  readonly uploadEvidence: {
    readonly evidenceEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly fileUrl: string | null | undefined;
        readonly filename: string;
        readonly id: string;
        readonly mimeType: string;
        readonly size: number;
        readonly state: EvidenceState;
        readonly type: EvidenceType;
        readonly url: string | null | undefined;
      };
    };
  };
};
export type ControlOverviewPageUploadEvidenceMutation = {
  response: ControlOverviewPageUploadEvidenceMutation$data;
  variables: ControlOverviewPageUploadEvidenceMutation$variables;
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
  "concreteType": "EvidenceEdge",
  "kind": "LinkedField",
  "name": "evidenceEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Evidence",
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
          "name": "filename",
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
          "name": "mimeType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
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
          "name": "state",
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
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadEvidence",
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
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadEvidence",
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
            "name": "evidenceEdge",
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
    "cacheID": "de3681706266cd453ddccb5fe2900ea8",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUploadEvidenceMutation(\n  $input: UploadEvidenceInput!\n) {\n  uploadEvidence(input: $input) {\n    evidenceEdge {\n      node {\n        id\n        filename\n        fileUrl\n        mimeType\n        type\n        url\n        size\n        state\n        createdAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "396146017c07e06dc709199a0b5ad012";

export default node;
