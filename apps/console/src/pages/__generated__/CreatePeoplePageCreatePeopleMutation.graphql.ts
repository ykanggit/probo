/**
 * @generated SignedSource<<ea3c61409629d685dbb651ca60a8d0b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PeopleKind = "CONTRACTOR" | "EMPLOYEE";
export type CreatePeopleInput = {
  additionalEmailAddresses?: ReadonlyArray<string> | null | undefined;
  fullName: string;
  kind: PeopleKind;
  organizationId: string;
  primaryEmailAddress: string;
};
export type CreatePeoplePageCreatePeopleMutation$variables = {
  input: CreatePeopleInput;
};
export type CreatePeoplePageCreatePeopleMutation$data = {
  readonly createPeople: {
    readonly additionalEmailAddresses: ReadonlyArray<string>;
    readonly fullName: string;
    readonly id: string;
    readonly kind: PeopleKind;
    readonly primaryEmailAddress: string;
  };
};
export type CreatePeoplePageCreatePeopleMutation = {
  response: CreatePeoplePageCreatePeopleMutation$data;
  variables: CreatePeoplePageCreatePeopleMutation$variables;
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
    "concreteType": "People",
    "kind": "LinkedField",
    "name": "createPeople",
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
    "name": "CreatePeoplePageCreatePeopleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreatePeoplePageCreatePeopleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6674304ecdd07af45a837b942faed8f3",
    "id": null,
    "metadata": {},
    "name": "CreatePeoplePageCreatePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation CreatePeoplePageCreatePeopleMutation(\n  $input: CreatePeopleInput!\n) {\n  createPeople(input: $input) {\n    id\n    fullName\n    primaryEmailAddress\n    additionalEmailAddresses\n    kind\n  }\n}\n"
  }
};
})();

(node as any).hash = "c2962b44f158d7899d7e5b4d071e9238";

export default node;
