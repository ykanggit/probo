/**
 * @generated SignedSource<<235fcc511660b289ffdc31ce06ec8873>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GetFileContentInput = {
  documentVersionId: string;
};
export type FilePreviewGetFileContentMutation$variables = {
  input: GetFileContentInput;
};
export type FilePreviewGetFileContentMutation$data = {
  readonly getFileContent: {
    readonly content: string;
    readonly fileName: string;
    readonly fileSize: number;
    readonly fileType: string;
  };
};
export type FilePreviewGetFileContentMutation = {
  response: FilePreviewGetFileContentMutation$data;
  variables: FilePreviewGetFileContentMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "GetFileContentPayload",
    "kind": "LinkedField",
    "name": "getFileContent",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "content",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fileName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fileType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "fileSize",
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
    "name": "FilePreviewGetFileContentMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FilePreviewGetFileContentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0a4227e1608db8374e9c39f185702577",
    "id": null,
    "metadata": {},
    "name": "FilePreviewGetFileContentMutation",
    "operationKind": "mutation",
    "text": "mutation FilePreviewGetFileContentMutation(\n  $input: GetFileContentInput!\n) {\n  getFileContent(input: $input) {\n    content\n    fileName\n    fileType\n    fileSize\n  }\n}\n"
  }
};
})();

(node as any).hash = "7cf296ec46b4505adb096eca22c5d44e";

export default node;
