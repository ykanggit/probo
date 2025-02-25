/**
 * @generated SignedSource<<8ecb9304d0a498d483d1a8c251f8c49a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TeamSwitcher_organizations$data = {
  readonly organizations: ReadonlyArray<{
    readonly id: string;
    readonly logoUrl: string;
    readonly name: string;
  }>;
  readonly " $fragmentType": "TeamSwitcher_organizations";
};
export type TeamSwitcher_organizations$key = {
  readonly " $data"?: TeamSwitcher_organizations$data;
  readonly " $fragmentSpreads": FragmentRefs<"TeamSwitcher_organizations">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TeamSwitcher_organizations",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Organization",
      "kind": "LinkedField",
      "name": "organizations",
      "plural": true,
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
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "logoUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "318f68b82b5b87500ec99ffcdd2929ab";

export default node;
