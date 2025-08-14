/**
 * @generated SignedSource<<5773d0630d11596682d41b4df95716c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AuditState = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "OUTDATED" | "REJECTED";
export type UpdateAuditInput = {
  id: string;
  name?: string | null | undefined;
  showOnTrustCenter?: boolean | null | undefined;
  state?: AuditState | null | undefined;
  validFrom?: any | null | undefined;
  validUntil?: any | null | undefined;
};
export type TrustCenterAuditGraphUpdateMutation$variables = {
  input: UpdateAuditInput;
};
export type TrustCenterAuditGraphUpdateMutation$data = {
  readonly updateAudit: {
    readonly audit: {
      readonly id: string;
      readonly showOnTrustCenter: boolean;
      readonly " $fragmentSpreads": FragmentRefs<"TrustCenterAuditsCardFragment">;
    };
  };
};
export type TrustCenterAuditGraphUpdateMutation = {
  response: TrustCenterAuditGraphUpdateMutation$data;
  variables: TrustCenterAuditGraphUpdateMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "showOnTrustCenter",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TrustCenterAuditGraphUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateAuditPayload",
        "kind": "LinkedField",
        "name": "updateAudit",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Audit",
            "kind": "LinkedField",
            "name": "audit",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TrustCenterAuditsCardFragment"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TrustCenterAuditGraphUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateAuditPayload",
        "kind": "LinkedField",
        "name": "updateAudit",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Audit",
            "kind": "LinkedField",
            "name": "audit",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Framework",
                "kind": "LinkedField",
                "name": "framework",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "validFrom",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "validUntil",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "state",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "createdAt",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d27b79a065314a22dbcbd8216de1268b",
    "id": null,
    "metadata": {},
    "name": "TrustCenterAuditGraphUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation TrustCenterAuditGraphUpdateMutation(\n  $input: UpdateAuditInput!\n) {\n  updateAudit(input: $input) {\n    audit {\n      id\n      showOnTrustCenter\n      ...TrustCenterAuditsCardFragment\n    }\n  }\n}\n\nfragment TrustCenterAuditsCardFragment on Audit {\n  id\n  name\n  framework {\n    name\n    id\n  }\n  validFrom\n  validUntil\n  state\n  showOnTrustCenter\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "1e92374989ecf8f439d069eb003e4e4e";

export default node;
