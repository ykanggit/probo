/**
 * @generated SignedSource<<4cf4f895bdcd936c74cb70f562210df7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlOverviewPageGetEvidenceFileUrlQuery$variables = {
  evidenceId: string;
};
export type ControlOverviewPageGetEvidenceFileUrlQuery$data = {
  readonly node: {
    readonly fileUrl?: string;
    readonly id?: string;
  };
};
export type ControlOverviewPageGetEvidenceFileUrlQuery = {
  response: ControlOverviewPageGetEvidenceFileUrlQuery$data;
  variables: ControlOverviewPageGetEvidenceFileUrlQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "evidenceId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "evidenceId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fileUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ControlOverviewPageGetEvidenceFileUrlQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "type": "Evidence",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ControlOverviewPageGetEvidenceFileUrlQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
            ],
            "type": "Evidence",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "debb5fda7cec88257a50998c78ee1e33",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageGetEvidenceFileUrlQuery",
    "operationKind": "query",
    "text": "query ControlOverviewPageGetEvidenceFileUrlQuery(\n  $evidenceId: ID!\n) {\n  node(id: $evidenceId) {\n    __typename\n    ... on Evidence {\n      id\n      fileUrl\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a97d9390a7415ff87916e268458f5ead";

export default node;
