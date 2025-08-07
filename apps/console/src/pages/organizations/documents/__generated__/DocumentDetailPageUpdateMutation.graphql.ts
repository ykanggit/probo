/**
 * @generated SignedSource<<78eb861601ac1babc8f02dc877d9e1cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DocumentType = "ISMS" | "OTHER" | "POLICY";
export type UpdateDocumentInput = {
  content?: string | null | undefined;
  createdBy?: string | null | undefined;
  documentType?: DocumentType | null | undefined;
  id: string;
  ownerId?: string | null | undefined;
  showOnTrustCenter?: boolean | null | undefined;
  title?: string | null | undefined;
};
export type DocumentDetailPageUpdateMutation$variables = {
  input: UpdateDocumentInput;
};
export type DocumentDetailPageUpdateMutation$data = {
  readonly updateDocument: {
    readonly document: {
      readonly id: string;
      readonly owner: {
        readonly fullName: string;
        readonly id: string;
      };
      readonly title: string;
    };
  };
};
export type DocumentDetailPageUpdateMutation = {
  response: DocumentDetailPageUpdateMutation$data;
  variables: DocumentDetailPageUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateDocumentPayload",
    "kind": "LinkedField",
    "name": "updateDocument",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Document",
        "kind": "LinkedField",
        "name": "document",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "People",
            "kind": "LinkedField",
            "name": "owner",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "DocumentDetailPageUpdateMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DocumentDetailPageUpdateMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "bb375479bf3446cccb49753a27fb6bcb",
    "id": null,
    "metadata": {},
    "name": "DocumentDetailPageUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation DocumentDetailPageUpdateMutation(\n  $input: UpdateDocumentInput!\n) {\n  updateDocument(input: $input) {\n    document {\n      id\n      title\n      owner {\n        id\n        fullName\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d204fe6a01448bd05d68699c06d18f9";

export default node;
