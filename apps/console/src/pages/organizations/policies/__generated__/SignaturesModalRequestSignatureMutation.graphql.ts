/**
 * @generated SignedSource<<fda822cf46d8b9a49852a53edd8e363d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PolicyVersionSignatureState = "REQUESTED" | "SIGNED";
export type RequestSignatureInput = {
  policyVersionId: string;
  signatoryId: string;
};
export type SignaturesModalRequestSignatureMutation$variables = {
  connections: ReadonlyArray<string>;
  input: RequestSignatureInput;
};
export type SignaturesModalRequestSignatureMutation$data = {
  readonly requestSignature: {
    readonly policyVersionSignatureEdge: {
      readonly node: {
        readonly id: string;
        readonly requestedAt: string;
        readonly requestedBy: {
          readonly fullName: string;
        };
        readonly signedAt: string | null | undefined;
        readonly signedBy: {
          readonly fullName: string;
          readonly id: string;
        };
        readonly state: PolicyVersionSignatureState;
      };
    };
  };
};
export type SignaturesModalRequestSignatureMutation = {
  response: SignaturesModalRequestSignatureMutation$data;
  variables: SignaturesModalRequestSignatureMutation$variables;
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
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "signedAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requestedAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v8 = [
  (v7/*: any*/),
  (v3/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "signedBy",
  "plural": false,
  "selections": (v8/*: any*/),
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
    "name": "SignaturesModalRequestSignatureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "RequestSignaturePayload",
        "kind": "LinkedField",
        "name": "requestSignature",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PolicyVersionSignatureEdge",
            "kind": "LinkedField",
            "name": "policyVersionSignatureEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PolicyVersionSignature",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "People",
                    "kind": "LinkedField",
                    "name": "requestedBy",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
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
    "name": "SignaturesModalRequestSignatureMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "RequestSignaturePayload",
        "kind": "LinkedField",
        "name": "requestSignature",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "PolicyVersionSignatureEdge",
            "kind": "LinkedField",
            "name": "policyVersionSignatureEdge",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PolicyVersionSignature",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "People",
                    "kind": "LinkedField",
                    "name": "requestedBy",
                    "plural": false,
                    "selections": (v8/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "policyVersionSignatureEdge",
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
    "cacheID": "4c6a5b6ed95c76c157f8627409a4481b",
    "id": null,
    "metadata": {},
    "name": "SignaturesModalRequestSignatureMutation",
    "operationKind": "mutation",
    "text": "mutation SignaturesModalRequestSignatureMutation(\n  $input: RequestSignatureInput!\n) {\n  requestSignature(input: $input) {\n    policyVersionSignatureEdge {\n      node {\n        id\n        state\n        signedAt\n        requestedAt\n        signedBy {\n          fullName\n          id\n        }\n        requestedBy {\n          fullName\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2b17fe4feae2614a6697c63a7334a1cf";

export default node;
