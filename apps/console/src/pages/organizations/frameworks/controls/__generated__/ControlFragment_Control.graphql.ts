/**
 * @generated SignedSource<<8c59833cd4588accdf1d316d9e494d26>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ControlFragment_Control$data = {
  readonly description: string;
  readonly id: string;
  readonly name: string;
  readonly referenceId: string;
  readonly " $fragmentType": "ControlFragment_Control";
};
export type ControlFragment_Control$key = {
  readonly " $data"?: ControlFragment_Control$data;
  readonly " $fragmentSpreads": FragmentRefs<"ControlFragment_Control">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ControlFragment_Control",
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
      "name": "description",
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
      "name": "referenceId",
      "storageKey": null
    }
  ],
  "type": "Control",
  "abstractKey": null
};

(node as any).hash = "ccbc9d6743d45b9a4049b661a1f0ad57";

export default node;
