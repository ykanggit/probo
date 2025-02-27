/**
 * @generated SignedSource<<190ec3d14b98c4685fcc363fc41cee96>>
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
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly version: number;
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
    "concreteType": "Framework",
    "kind": "LinkedField",
    "name": "updateFramework",
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
    "cacheID": "f0f708c6034a6f3c27fbad0193535e51",
    "id": null,
    "metadata": {},
    "name": "UpdateFrameworkPageUpdateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateFrameworkPageUpdateFrameworkMutation(\n  $input: UpdateFrameworkInput!\n) {\n  updateFramework(input: $input) {\n    id\n    name\n    description\n    version\n  }\n}\n"
  }
};
})();

(node as any).hash = "b8a8cebfad0ef454a5d5436b61cc595c";

export default node;
