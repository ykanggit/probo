/**
 * @generated SignedSource<<552b78c5e34c5ce2065dd1190f47f632>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PeopleKind = "CONTRACTOR" | "EMPLOYEE" | "SERVICE_ACCOUNT";
export type UpdatePeopleInput = {
  additionalEmailAddresses?: ReadonlyArray<string> | null | undefined;
  fullName?: string | null | undefined;
  id: string;
  kind?: PeopleKind | null | undefined;
  primaryEmailAddress?: string | null | undefined;
};
export type PeopleViewUpdatePeopleMutation$variables = {
  input: UpdatePeopleInput;
};
export type PeopleViewUpdatePeopleMutation$data = {
  readonly updatePeople: {
    readonly people: {
      readonly additionalEmailAddresses: ReadonlyArray<string>;
      readonly fullName: string;
      readonly id: string;
      readonly kind: PeopleKind;
      readonly primaryEmailAddress: string;
      readonly updatedAt: string;
    };
  };
};
export type PeopleViewUpdatePeopleMutation = {
  response: PeopleViewUpdatePeopleMutation$data;
  variables: PeopleViewUpdatePeopleMutation$variables;
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
    "name": "PeopleViewUpdatePeopleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PeopleViewUpdatePeopleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d09fc02a745b951e278cd492343e49f1",
    "id": null,
    "metadata": {},
    "name": "PeopleViewUpdatePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleViewUpdatePeopleMutation(\n  $input: UpdatePeopleInput!\n) {\n  updatePeople(input: $input) {\n    people {\n      id\n      fullName\n      primaryEmailAddress\n      additionalEmailAddresses\n      kind\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "15fece3e846bd713533b9e91a1ceffe2";

export default node;
