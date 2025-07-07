/**
 * @generated SignedSource<<06126b60bc37d8fbbb9a475af6d5d29d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DocumentVersionHistoryDialogExportPDFMutation$variables = {
  documentVersionId: string;
};
export type DocumentVersionHistoryDialogExportPDFMutation$data = {
  readonly exportDocumentVersionPDF: {
    readonly data: string;
  };
};
export type DocumentVersionHistoryDialogExportPDFMutation = {
  response: DocumentVersionHistoryDialogExportPDFMutation$data;
  variables: DocumentVersionHistoryDialogExportPDFMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "documentVersionId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "documentVersionId",
            "variableName": "documentVersionId"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "ExportDocumentVersionPDFPayload",
    "kind": "LinkedField",
    "name": "exportDocumentVersionPDF",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "data",
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
    "name": "DocumentVersionHistoryDialogExportPDFMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DocumentVersionHistoryDialogExportPDFMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "45204e42c1018e00dcceaae84eb9a5f7",
    "id": null,
    "metadata": {},
    "name": "DocumentVersionHistoryDialogExportPDFMutation",
    "operationKind": "mutation",
    "text": "mutation DocumentVersionHistoryDialogExportPDFMutation(\n  $documentVersionId: ID!\n) {\n  exportDocumentVersionPDF(input: {documentVersionId: $documentVersionId}) {\n    data\n  }\n}\n"
  }
};
})();

(node as any).hash = "587bcc8bb6cf72e64a5eca18769ac432";

export default node;
