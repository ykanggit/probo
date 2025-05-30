/**
 * @generated SignedSource<<cbf5b6ff35e9f54f26becd5378ccb4cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NewAssetView_organization$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PeopleSelector_organization">;
  readonly " $fragmentType": "NewAssetView_organization";
};
export type NewAssetView_organization$key = {
  readonly " $data"?: NewAssetView_organization$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewAssetView_organization">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NewAssetView_organization",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PeopleSelector_organization"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "96eb63be6b58e29a7bd3dafaaa07d5a4";

export default node;
