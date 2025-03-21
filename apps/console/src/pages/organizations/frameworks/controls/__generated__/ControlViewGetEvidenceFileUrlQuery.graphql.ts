/**
 * @generated SignedSource<<6097cb76bff61c342c2b6389a8e7f618>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ControlViewGetEvidenceFileUrlQuery$variables = {
  evidenceId: string;
};
export type ControlViewGetEvidenceFileUrlQuery$data = {
  readonly node: {
    readonly fileUrl?: string | null | undefined;
    readonly id?: string;
  };
};
export type ControlViewGetEvidenceFileUrlQuery = {
  response: ControlViewGetEvidenceFileUrlQuery$data;
  variables: ControlViewGetEvidenceFileUrlQuery$variables;
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
    "name": "ControlViewGetEvidenceFileUrlQuery",
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
    "name": "ControlViewGetEvidenceFileUrlQuery",
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
    "cacheID": "b656f027db1774647bcd0eefad36f66f",
    "id": null,
    "metadata": {},
    "name": "ControlViewGetEvidenceFileUrlQuery",
    "operationKind": "query",
    "text": "query ControlViewGetEvidenceFileUrlQuery(\n  $evidenceId: ID!\n) {\n  node(id: $evidenceId) {\n    __typename\n    ... on Evidence {\n      id\n      fileUrl\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "a06f8279b87274b3cec4a11f44a53f49";

export default node;
