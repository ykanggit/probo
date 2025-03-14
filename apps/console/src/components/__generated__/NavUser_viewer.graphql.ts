/**
 * @generated SignedSource<<0d5ada0f912fcf3a8f2f3328b0943b28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NavUser_viewer$data = {
  readonly user: {
    readonly email: string;
    readonly fullName: string;
    readonly id: string;
  };
  readonly " $fragmentType": "NavUser_viewer";
};
export type NavUser_viewer$key = {
  readonly " $data"?: NavUser_viewer$data;
  readonly " $fragmentSpreads": FragmentRefs<"NavUser_viewer">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NavUser_viewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "user",
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
          "name": "fullName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};

(node as any).hash = "05e26e238976738b4cff26f37c5f29e7";

export default node;
