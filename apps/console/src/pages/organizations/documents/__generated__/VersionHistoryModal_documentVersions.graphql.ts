/**
 * @generated SignedSource<<00c4778ab72567e2c573d98bdbbc4c5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DocumentStatus = "DRAFT" | "PUBLISHED";
import { FragmentRefs } from "relay-runtime";
export type VersionHistoryModal_documentVersions$data = {
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
        readonly owner: {
          readonly fullName: string;
        };
        readonly publishedAt: string | null | undefined;
        readonly publishedBy: {
          readonly fullName: string;
        } | null | undefined;
        readonly status: DocumentStatus;
        readonly title: string;
        readonly updatedAt: string;
        readonly version: number;
      };
    }>;
  };
  readonly " $fragmentType": "VersionHistoryModal_documentVersions";
};
export type VersionHistoryModal_documentVersions$key = {
  readonly " $data"?: VersionHistoryModal_documentVersions$data;
  readonly " $fragmentSpreads": FragmentRefs<"VersionHistoryModal_documentVersions">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fullName",
    "storageKey": null
  }
],
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "owner",
  "plural": false,
  "selections": (v1/*: any*/),
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "VersionHistoryModal_documentVersions",
  "selections": [
    (v0/*: any*/),
    (v2/*: any*/),
    {
      "alias": "versionHistory",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "DocumentVersionConnection",
      "kind": "LinkedField",
      "name": "versions",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "DocumentVersionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "DocumentVersion",
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
                (v0/*: any*/),
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
                (v2/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "People",
                  "kind": "LinkedField",
                  "name": "publishedBy",
                  "plural": false,
                  "selections": (v1/*: any*/),
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
  "type": "Document",
  "abstractKey": null
};
})();

(node as any).hash = "344e822be4a3eb20d147ecd1c3ea7ced";

export default node;
