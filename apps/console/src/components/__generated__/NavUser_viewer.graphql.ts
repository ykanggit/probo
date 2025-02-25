/**
 * @generated SignedSource<<0965f25c8dedb59a9316e4df4d773af6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NavUser_viewer$data = {
  readonly email: string;
  readonly fullName: string;
  readonly id: string;
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
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "7ee85a272f543b514c5a6a3148fd1613";

export default node;
