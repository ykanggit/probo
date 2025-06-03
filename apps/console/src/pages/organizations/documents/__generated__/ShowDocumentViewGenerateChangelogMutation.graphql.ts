/**
 * @generated SignedSource<<7743b633410bdb28ce017cc0799f2df4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GenerateDocumentChangelogInput = {
  documentId: string;
};
export type ShowDocumentViewGenerateChangelogMutation$variables = {
  input: GenerateDocumentChangelogInput;
};
export type ShowDocumentViewGenerateChangelogMutation$data = {
  readonly generateDocumentChangelog: {
    readonly changelog: string;
  };
};
export type ShowDocumentViewGenerateChangelogMutation = {
  response: ShowDocumentViewGenerateChangelogMutation$data;
  variables: ShowDocumentViewGenerateChangelogMutation$variables;
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
    "concreteType": "GenerateDocumentChangelogPayload",
    "kind": "LinkedField",
    "name": "generateDocumentChangelog",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "changelog",
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
    "name": "ShowDocumentViewGenerateChangelogMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ShowDocumentViewGenerateChangelogMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8051b5412b1d2d73a7fe686890e86f41",
    "id": null,
    "metadata": {},
    "name": "ShowDocumentViewGenerateChangelogMutation",
    "operationKind": "mutation",
    "text": "mutation ShowDocumentViewGenerateChangelogMutation(\n  $input: GenerateDocumentChangelogInput!\n) {\n  generateDocumentChangelog(input: $input) {\n    changelog\n  }\n}\n"
  }
};
})();

(node as any).hash = "60be598c9c528b2173be7be580057ea7";

export default node;
