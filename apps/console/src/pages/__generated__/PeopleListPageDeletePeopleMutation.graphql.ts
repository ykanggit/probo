/**
 * @generated SignedSource<<0dfa6dd207341bf77daca8afe8418c41>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeletePeopleInput = {
  peopleId: string;
};
export type PeopleListPageDeletePeopleMutation$variables = {
  input: DeletePeopleInput;
};
export type PeopleListPageDeletePeopleMutation$data = {
  readonly deletePeople: any;
};
export type PeopleListPageDeletePeopleMutation = {
  response: PeopleListPageDeletePeopleMutation$data;
  variables: PeopleListPageDeletePeopleMutation$variables;
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
    "kind": "ScalarField",
    "name": "deletePeople",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleListPageDeletePeopleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PeopleListPageDeletePeopleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ee5d2a94a7fae0b106873b6cd1cc7d0b",
    "id": null,
    "metadata": {},
    "name": "PeopleListPageDeletePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleListPageDeletePeopleMutation(\n  $input: DeletePeopleInput!\n) {\n  deletePeople(input: $input)\n}\n"
  }
};
})();

(node as any).hash = "d6077ac452cabbacf8678fe527ce928a";

export default node;
