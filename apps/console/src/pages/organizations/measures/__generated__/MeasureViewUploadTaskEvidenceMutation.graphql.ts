/**
 * @generated SignedSource<<4539152ef13af3aca3a79891c5b81a79>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvidenceState = "FULFILLED" | "REQUESTED";
export type EvidenceType = "FILE" | "LINK";
export type UploadTaskEvidenceInput = {
  file: any;
  taskId: string;
};
export type MeasureViewUploadTaskEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: UploadTaskEvidenceInput;
};
export type MeasureViewUploadTaskEvidenceMutation$data = {
  readonly uploadTaskEvidence: {
    readonly evidenceEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string;
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
export type MeasureViewUploadTaskEvidenceMutation = {
  response: MeasureViewUploadTaskEvidenceMutation$data;
  variables: MeasureViewUploadTaskEvidenceMutation$variables;
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
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
    "name": "MeasureViewUploadTaskEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadTaskEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadTaskEvidence",
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
    "name": "MeasureViewUploadTaskEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadTaskEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadTaskEvidence",
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
    "cacheID": "2c18eec6e7e3d428ad6fbdf4c52ccf94",
    "id": null,
    "metadata": {},
    "name": "MeasureViewUploadTaskEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation MeasureViewUploadTaskEvidenceMutation(\n  $input: UploadTaskEvidenceInput!\n) {\n  uploadTaskEvidence(input: $input) {\n    evidenceEdge {\n      node {\n        id\n        filename\n        fileUrl\n        mimeType\n        type\n        url\n        size\n        state\n        createdAt\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3649fc872c9f58d4ffd0181b0316c812";

export default node;
