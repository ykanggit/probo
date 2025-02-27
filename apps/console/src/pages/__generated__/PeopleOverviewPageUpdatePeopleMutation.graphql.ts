/**
 * @generated SignedSource<<aa7d9efd2aaaa6af57bfc956754c69dd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PeopleKind = "CONTRACTOR" | "EMPLOYEE";
export type UpdatePeopleInput = {
  additionalEmailAddresses?: ReadonlyArray<string> | null | undefined;
  expectedVersion: number;
  fullName?: string | null | undefined;
  id: string;
  kind?: PeopleKind | null | undefined;
  primaryEmailAddress?: string | null | undefined;
};
export type PeopleOverviewPageUpdatePeopleMutation$variables = {
  input: UpdatePeopleInput;
};
export type PeopleOverviewPageUpdatePeopleMutation$data = {
  readonly updatePeople: {
    readonly people: {
      readonly additionalEmailAddresses: ReadonlyArray<string>;
      readonly fullName: string;
      readonly id: string;
      readonly kind: PeopleKind;
      readonly primaryEmailAddress: string;
      readonly updatedAt: any;
      readonly version: number;
    };
  };
};
export type PeopleOverviewPageUpdatePeopleMutation = {
  response: PeopleOverviewPageUpdatePeopleMutation$data;
  variables: PeopleOverviewPageUpdatePeopleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdatePeoplePayload",
    "kind": "LinkedField",
    "name": "updatePeople",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "People",
        "kind": "LinkedField",
        "name": "people",
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
            "name": "primaryEmailAddress",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "additionalEmailAddresses",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "kind",
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
            "kind": "ScalarField",
            "name": "version",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleOverviewPageUpdatePeopleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PeopleOverviewPageUpdatePeopleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6961fac292b72111b2d0a46f078e3efc",
    "id": null,
    "metadata": {},
    "name": "PeopleOverviewPageUpdatePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleOverviewPageUpdatePeopleMutation(\n  $input: UpdatePeopleInput!\n) {\n  updatePeople(input: $input) {\n    people {\n      id\n      fullName\n      primaryEmailAddress\n      additionalEmailAddresses\n      kind\n      updatedAt\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "01a8fefe43cdc344f9a4dd62a60edc6c";

export default node;
