/**
 * @generated SignedSource<<21626cad90fcb579071d73bc47e3fb7a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type PolicyStatus = "DRAFT" | "PUBLISHED";
import { FragmentRefs } from "relay-runtime";
export type VersionHistoryModal_policyVersions$data = {
  readonly owner: {
    readonly fullName: string;
  };
  readonly title: string;
  readonly versionHistory: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly changelog: string;
        readonly content: string;
        readonly id: string;
        readonly publishedAt: string | null | undefined;
        readonly publishedBy: {
          readonly fullName: string;
        } | null | undefined;
        readonly status: PolicyStatus;
        readonly updatedAt: string;
        readonly version: number;
      };
    }>;
  };
  readonly " $fragmentType": "VersionHistoryModal_policyVersions";
};
export type VersionHistoryModal_policyVersions$key = {
  readonly " $data"?: VersionHistoryModal_policyVersions$data;
  readonly " $fragmentSpreads": FragmentRefs<"VersionHistoryModal_policyVersions">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fullName",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "VersionHistoryModal_policyVersions",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "People",
      "kind": "LinkedField",
      "name": "owner",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": "versionHistory",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "PolicyVersionConnection",
      "kind": "LinkedField",
      "name": "versions",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "PolicyVersionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "PolicyVersion",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "version",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "status",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "content",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "changelog",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "publishedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "updatedAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "People",
                  "kind": "LinkedField",
                  "name": "publishedBy",
                  "plural": false,
                  "selections": (v0/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "versions(first:20)"
    }
  ],
  "type": "Policy",
  "abstractKey": null
};
})();

(node as any).hash = "09cd9142880cfbb239ce866ea81afe48";

export default node;
