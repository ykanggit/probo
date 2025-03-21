/**
 * @generated SignedSource<<5cc5a8fcb02623e685586d2f3510fb4a>>
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
export type ControlViewDeleteEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteEvidenceInput;
};
export type ControlViewDeleteEvidenceMutation$data = {
  readonly deleteEvidence: {
    readonly deletedEvidenceId: string;
  };
};
export type ControlViewDeleteEvidenceMutation = {
  response: ControlViewDeleteEvidenceMutation$data;
  variables: ControlViewDeleteEvidenceMutation$variables;
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
    "name": "ControlViewDeleteEvidenceMutation",
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
    "name": "ControlViewDeleteEvidenceMutation",
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
    "cacheID": "594da4829274c817424f9b84ba99a5a6",
    "id": null,
    "metadata": {},
    "name": "ControlViewDeleteEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation ControlViewDeleteEvidenceMutation(\n  $input: DeleteEvidenceInput!\n) {\n  deleteEvidence(input: $input) {\n    deletedEvidenceId\n  }\n}\n"
  }
};
})();

(node as any).hash = "a6b5e90e931adf04f45be9403b291ad9";

export default node;
