/**
 * @generated SignedSource<<1517cf7236f96500239781562cff66e4>>
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
    readonly url: string;
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
        "name": "url",
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
    "cacheID": "0dfccdfa75539c4621ec1bf7aab05ad2",
    "id": null,
    "metadata": {},
    "name": "FrameworkLayoutViewExportAuditMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkLayoutViewExportAuditMutation(\n  $input: ExportAuditInput!\n) {\n  exportAudit(input: $input) {\n    url\n  }\n}\n"
  }
};
})();

(node as any).hash = "28679b1a4e375eb17a72e9e236f2e2ee";

export default node;
