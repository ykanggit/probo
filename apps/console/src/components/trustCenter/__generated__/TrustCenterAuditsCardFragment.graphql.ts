/**
 * @generated SignedSource<<b29f60aeb151f0b4ded9ebb02829b67f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AuditState = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "OUTDATED" | "REJECTED";
import { FragmentRefs } from "relay-runtime";
export type TrustCenterAuditsCardFragment$data = {
  readonly createdAt: any;
  readonly framework: {
    readonly name: string;
  };
  readonly id: string;
  readonly name: string | null | undefined;
  readonly showOnTrustCenter: boolean;
  readonly state: AuditState;
  readonly validFrom: any | null | undefined;
  readonly validUntil: any | null | undefined;
  readonly " $fragmentType": "TrustCenterAuditsCardFragment";
};
export type TrustCenterAuditsCardFragment$key = {
  readonly " $data"?: TrustCenterAuditsCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrustCenterAuditsCardFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrustCenterAuditsCardFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Framework",
      "kind": "LinkedField",
      "name": "framework",
      "plural": false,
      "selections": [
        (v0/*: any*/)
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
      "name": "showOnTrustCenter",
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
  "type": "Audit",
  "abstractKey": null
};
})();

(node as any).hash = "1c5db1ae603a40619342702f790adfeb";

export default node;
