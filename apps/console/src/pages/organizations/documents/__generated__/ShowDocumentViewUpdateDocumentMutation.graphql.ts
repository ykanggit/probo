/**
 * @generated SignedSource<<5cf1d2c84b94cf4c7d35965f67b36191>>
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
  title?: string | null | undefined;
};
export type ShowDocumentViewUpdateDocumentMutation$variables = {
  input: UpdateDocumentInput;
};
export type ShowDocumentViewUpdateDocumentMutation$data = {
  readonly updateDocument: {
    readonly document: {
      readonly documentType: DocumentType;
      readonly id: string;
      readonly owner: {
        readonly fullName: string;
        readonly id: string;
        readonly primaryEmailAddress: string;
      };
      readonly title: string;
    };
  };
};
export type ShowDocumentViewUpdateDocumentMutation = {
  response: ShowDocumentViewUpdateDocumentMutation$data;
  variables: ShowDocumentViewUpdateDocumentMutation$variables;
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
            "name": "documentType",
            "storageKey": null
          },
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "primaryEmailAddress",
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
    "name": "ShowDocumentViewUpdateDocumentMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowDocumentViewUpdateDocumentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "81d866e2f2de8bc1d7d440bfb2c66144",
    "id": null,
    "metadata": {},
    "name": "ShowDocumentViewUpdateDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation ShowDocumentViewUpdateDocumentMutation(\n  $input: UpdateDocumentInput!\n) {\n  updateDocument(input: $input) {\n    document {\n      id\n      documentType\n      title\n      owner {\n        id\n        fullName\n        primaryEmailAddress\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "acaf0d38623ccc096f19c9d6c3e05c69";

export default node;
