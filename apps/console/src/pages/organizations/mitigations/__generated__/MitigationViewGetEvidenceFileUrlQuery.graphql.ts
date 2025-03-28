/**
 * @generated SignedSource<<c39e6569df1609b4a9cf0a6c1673df3a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MitigationViewGetEvidenceFileUrlQuery$variables = {
  evidenceId: string;
};
export type MitigationViewGetEvidenceFileUrlQuery$data = {
  readonly node: {
    readonly fileUrl?: string | null | undefined;
    readonly id?: string;
  };
};
export type MitigationViewGetEvidenceFileUrlQuery = {
  response: MitigationViewGetEvidenceFileUrlQuery$data;
  variables: MitigationViewGetEvidenceFileUrlQuery$variables;
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
    "name": "MitigationViewGetEvidenceFileUrlQuery",
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
    "name": "MitigationViewGetEvidenceFileUrlQuery",
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
    "cacheID": "1dc81a5d665b9141b5cd62ef893ff0e1",
    "id": null,
    "metadata": {},
    "name": "MitigationViewGetEvidenceFileUrlQuery",
    "operationKind": "query",
    "text": "query MitigationViewGetEvidenceFileUrlQuery(\n  $evidenceId: ID!\n) {\n  node(id: $evidenceId) {\n    __typename\n    ... on Evidence {\n      id\n      fileUrl\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9d7bbfc81ce73246b671989102da3192";

export default node;
