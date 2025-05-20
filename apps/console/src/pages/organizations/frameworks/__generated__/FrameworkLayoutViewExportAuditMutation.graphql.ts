/**
 * @generated SignedSource<<c25a5f65159da12ec86ca608b7583a67>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ExportAuditInput = {
  frameworkId: string;
};
export type FrameworkLayoutViewExportAuditMutation$variables = {
  input: ExportAuditInput;
};
export type FrameworkLayoutViewExportAuditMutation$data = {
  readonly exportAudit: {
    readonly success: boolean;
  };
};
export type FrameworkLayoutViewExportAuditMutation = {
  response: FrameworkLayoutViewExportAuditMutation$data;
  variables: FrameworkLayoutViewExportAuditMutation$variables;
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
    "concreteType": "ExportAuditPayload",
    "kind": "LinkedField",
    "name": "exportAudit",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "FrameworkLayoutViewExportAuditMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FrameworkLayoutViewExportAuditMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a0f656b50acde2ef3c3fef73e2155e9f",
    "id": null,
    "metadata": {},
    "name": "FrameworkLayoutViewExportAuditMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkLayoutViewExportAuditMutation(\n  $input: ExportAuditInput!\n) {\n  exportAudit(input: $input) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "b7347f4f8e292580e056793df6c270a5";

export default node;
