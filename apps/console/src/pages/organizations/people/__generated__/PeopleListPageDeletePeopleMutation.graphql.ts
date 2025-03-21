/**
 * @generated SignedSource<<c4cdffc060744bb3853074ed3b123f61>>
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
  connections: ReadonlyArray<string>;
  input: DeletePeopleInput;
};
export type PeopleListPageDeletePeopleMutation$data = {
  readonly deletePeople: {
    readonly deletedPeopleId: string;
  };
};
export type PeopleListPageDeletePeopleMutation = {
  response: PeopleListPageDeletePeopleMutation$data;
  variables: PeopleListPageDeletePeopleMutation$variables;
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
    "name": "PeopleListPageDeletePeopleMutation",
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
    "name": "PeopleListPageDeletePeopleMutation",
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
    "cacheID": "977639987276708b1e4758508eaaf439",
    "id": null,
    "metadata": {},
    "name": "PeopleListPageDeletePeopleMutation",
    "operationKind": "mutation",
    "text": "mutation PeopleListPageDeletePeopleMutation(\n  $input: DeletePeopleInput!\n) {\n  deletePeople(input: $input) {\n    deletedPeopleId\n  }\n}\n"
  }
};
})();

(node as any).hash = "6552abc6c02cdc2c8e84ebbce1eb51f1";

export default node;
