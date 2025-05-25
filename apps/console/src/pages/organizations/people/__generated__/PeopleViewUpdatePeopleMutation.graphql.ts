/**
 * @generated SignedSource<<ca7c481401202c2276b4212dfffd54d4>>
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
  contractEndDate?: string | null | undefined;
  contractStartDate?: string | null | undefined;
  fullName?: string | null | undefined;
  id: string;
  kind?: PeopleKind | null | undefined;
  position?: string | null | undefined;
  primaryEmailAddress?: string | null | undefined;
};
export type PeopleViewUpdatePeopleMutation$variables = {
  input: UpdatePeopleInput;
};
export type PeopleViewUpdatePeopleMutation$data = {
  readonly updatePeople: {
    readonly people: {
      readonly additionalEmailAddresses: ReadonlyArray<string>;
      readonly contractEndDate: string | null | undefined;
      readonly contractStartDate: string | null | undefined;
      readonly fullName: string;
      readonly id: string;
      readonly kind: PeopleKind;
      readonly position: string | null | undefined;
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
            "name": "position",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "contractStartDate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "contractEndDate",
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
    "cacheID": "d3bc10093e65e1a612f22687ee2fffed",
    "id": null,
    "metadata": {},
    "name": "PeopleViewUpdatePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleViewUpdatePeopleMutation(\n  $input: UpdatePeopleInput!\n) {\n  updatePeople(input: $input) {\n    people {\n      id\n      fullName\n      primaryEmailAddress\n      additionalEmailAddresses\n      kind\n      position\n      contractStartDate\n      contractEndDate\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "af9cd62a7e73738d72e3ab9ad5ecdc10";

export default node;
