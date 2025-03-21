/**
 * @generated SignedSource<<4f30528c9f1b2def73d7058623843697>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateOrganizationViewViewerQuery$variables = Record<PropertyKey, never>;
export type CreateOrganizationViewViewerQuery$data = {
  readonly viewer: {
    readonly id: string;
  };
};
export type CreateOrganizationViewViewerQuery = {
  response: CreateOrganizationViewViewerQuery$data;
  variables: CreateOrganizationViewViewerQuery$variables;
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
    "name": "CreateOrganizationViewViewerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CreateOrganizationViewViewerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "70c2f23f09fbeac5b8e8436e6c68b5f6",
    "id": null,
    "metadata": {},
    "name": "CreateOrganizationViewViewerQuery",
    "operationKind": "query",
    "text": "query CreateOrganizationViewViewerQuery {\n  viewer {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "200816c6c6173d8c7a4e5bcdab45dc45";

export default node;
