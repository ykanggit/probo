/**
 * @generated SignedSource<<371bd1a7433b281f20dd8925915a7ff2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateOrganizationPageViewerQuery$variables = Record<PropertyKey, never>;
export type CreateOrganizationPageViewerQuery$data = {
  readonly viewer: {
    readonly id: string;
  };
};
export type CreateOrganizationPageViewerQuery = {
  response: CreateOrganizationPageViewerQuery$data;
  variables: CreateOrganizationPageViewerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Viewer",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateOrganizationPageViewerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreateOrganizationPageViewerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "8bb495e88bada2ffda332ffbc11f3340",
    "id": null,
    "metadata": {},
    "name": "CreateOrganizationPageViewerQuery",
    "operationKind": "query",
    "text": "query CreateOrganizationPageViewerQuery {\n  viewer {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2341c7947749857243e9f492235dfd61";

export default node;
