/**
 * @generated SignedSource<<822ef9b3867da7de4bca37e5be0e077e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateFrameworkInput = {
  description?: string | null | undefined;
  expectedVersion: number;
  id: string;
  name?: string | null | undefined;
};
export type UpdateFrameworkPageUpdateFrameworkMutation$variables = {
  input: UpdateFrameworkInput;
};
export type UpdateFrameworkPageUpdateFrameworkMutation$data = {
  readonly updateFramework: {
    readonly framework: {
      readonly description: string;
      readonly id: string;
      readonly name: string;
      readonly version: number;
    };
  };
};
export type UpdateFrameworkPageUpdateFrameworkMutation = {
  response: UpdateFrameworkPageUpdateFrameworkMutation$data;
  variables: UpdateFrameworkPageUpdateFrameworkMutation$variables;
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
    "concreteType": "UpdateFrameworkPayload",
    "kind": "LinkedField",
    "name": "updateFramework",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Framework",
        "kind": "LinkedField",
        "name": "framework",
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
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
    "name": "UpdateFrameworkPageUpdateFrameworkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateFrameworkPageUpdateFrameworkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d85d38851d3d94709a5b6c4090678ea4",
    "id": null,
    "metadata": {},
    "name": "UpdateFrameworkPageUpdateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateFrameworkPageUpdateFrameworkMutation(\n  $input: UpdateFrameworkInput!\n) {\n  updateFramework(input: $input) {\n    framework {\n      id\n      name\n      description\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c363b35a095da9142d61907ca7ba3c62";

export default node;
