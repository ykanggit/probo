/**
 * @generated SignedSource<<0602531d8b8a402e73b4823e6393da31>>
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
export type PeopleListViewDeletePeopleMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeletePeopleInput;
};
export type PeopleListViewDeletePeopleMutation$data = {
  readonly deletePeople: {
    readonly deletedPeopleId: string;
  };
};
export type PeopleListViewDeletePeopleMutation = {
  response: PeopleListViewDeletePeopleMutation$data;
  variables: PeopleListViewDeletePeopleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedPeopleId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleListViewDeletePeopleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeletePeoplePayload",
        "kind": "LinkedField",
        "name": "deletePeople",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PeopleListViewDeletePeopleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "DeletePeoplePayload",
        "kind": "LinkedField",
        "name": "deletePeople",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedPeopleId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2b9ad65c15101fb4e421c78ca4fd871c",
    "id": null,
    "metadata": {},
    "name": "PeopleListViewDeletePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleListViewDeletePeopleMutation(\n  $input: DeletePeopleInput!\n) {\n  deletePeople(input: $input) {\n    deletedPeopleId\n  }\n}\n"
  }
};
})();

(node as any).hash = "cc33cd4710c915cec66c217c010d728b";

export default node;
