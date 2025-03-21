/**
 * @generated SignedSource<<c09b83c20157fc20bf74a2c9c031b716>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteEvidenceInput = {
  evidenceId: string;
};
export type ControlOverviewPageDeleteEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteEvidenceInput;
};
export type ControlOverviewPageDeleteEvidenceMutation$data = {
  readonly deleteEvidence: {
    readonly deletedEvidenceId: string;
  };
};
export type ControlOverviewPageDeleteEvidenceMutation = {
  response: ControlOverviewPageDeleteEvidenceMutation$data;
  variables: ControlOverviewPageDeleteEvidenceMutation$variables;
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
  "kind": "ScalarField",
  "name": "deletedEvidenceId",
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
    "name": "ControlOverviewPageDeleteEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteEvidencePayload",
        "kind": "LinkedField",
        "name": "deleteEvidence",
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
    "name": "ControlOverviewPageDeleteEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeleteEvidencePayload",
        "kind": "LinkedField",
        "name": "deleteEvidence",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedEvidenceId",
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
    "cacheID": "51d62fb682189fa0aaa5cc5b7a5b7862",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageDeleteEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageDeleteEvidenceMutation(\n  $input: DeleteEvidenceInput!\n) {\n  deleteEvidence(input: $input) {\n    deletedEvidenceId\n  }\n}\n"
  }
};
})();

(node as any).hash = "f55cf1c279c95dcabc11e1b5aafcdc46";

export default node;
