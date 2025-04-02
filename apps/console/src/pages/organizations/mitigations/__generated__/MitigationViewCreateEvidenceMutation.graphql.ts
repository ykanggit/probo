/**
 * @generated SignedSource<<beb765793d4559382ee625dffd7a510c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvidenceState = "FULFILLED" | "REQUESTED";
export type EvidenceType = "FILE" | "LINK";
export type CreateEvidenceInput = {
  description: string;
  file?: any | null | undefined;
  name: string;
  taskId: string;
  type: EvidenceType;
  url?: string | null | undefined;
};
export type MitigationViewCreateEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateEvidenceInput;
};
export type MitigationViewCreateEvidenceMutation$data = {
  readonly createEvidence: {
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
export type MitigationViewCreateEvidenceMutation = {
  response: MitigationViewCreateEvidenceMutation$data;
  variables: MitigationViewCreateEvidenceMutation$variables;
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
    "name": "MitigationViewCreateEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateEvidencePayload",
        "kind": "LinkedField",
        "name": "createEvidence",
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
    "name": "MitigationViewCreateEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateEvidencePayload",
        "kind": "LinkedField",
        "name": "createEvidence",
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
    "cacheID": "ca3148cb5b3c59fec3bd9ff9c281f364",
    "id": null,
    "metadata": {},
    "name": "MitigationViewCreateEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewCreateEvidenceMutation(\n  $input: CreateEvidenceInput!\n) {\n  createEvidence(input: $input) {\n    evidenceEdge {\n      node {\n        id\n        filename\n        fileUrl\n        mimeType\n        type\n        url\n        size\n        state\n        createdAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "dac05ab414b2e09e801df5b0be9532a3";

export default node;
