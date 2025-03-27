/**
 * @generated SignedSource<<c7cba05f3dbc917afc82d3a3dae6045c>>
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
export type MitigationViewDeleteEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteEvidenceInput;
};
export type MitigationViewDeleteEvidenceMutation$data = {
  readonly deleteEvidence: {
    readonly deletedEvidenceId: string;
  };
};
export type MitigationViewDeleteEvidenceMutation = {
  response: MitigationViewDeleteEvidenceMutation$data;
  variables: MitigationViewDeleteEvidenceMutation$variables;
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
    "name": "MitigationViewDeleteEvidenceMutation",
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
    "name": "MitigationViewDeleteEvidenceMutation",
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
    "cacheID": "4770e84f6f87fb95b9f102cf8e572f44",
    "id": null,
    "metadata": {},
    "name": "MitigationViewDeleteEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation MitigationViewDeleteEvidenceMutation(\n  $input: DeleteEvidenceInput!\n) {\n  deleteEvidence(input: $input) {\n    deletedEvidenceId\n  }\n}\n"
  }
};
})();

(node as any).hash = "993f84f2e310e888a78200abb9b79ae0";

export default node;
