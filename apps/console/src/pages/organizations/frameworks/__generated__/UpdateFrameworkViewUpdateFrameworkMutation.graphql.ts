/**
 * @generated SignedSource<<115402b83869511df5e91ab206ae99e3>>
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
export type UpdateFrameworkViewUpdateFrameworkMutation$variables = {
  input: UpdateFrameworkInput;
};
export type UpdateFrameworkViewUpdateFrameworkMutation$data = {
  readonly updateFramework: {
    readonly framework: {
      readonly description: string;
      readonly id: string;
      readonly name: string;
      readonly version: number;
    };
  };
};
export type UpdateFrameworkViewUpdateFrameworkMutation = {
  response: UpdateFrameworkViewUpdateFrameworkMutation$data;
  variables: UpdateFrameworkViewUpdateFrameworkMutation$variables;
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
    "name": "UpdateFrameworkViewUpdateFrameworkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateFrameworkViewUpdateFrameworkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08fc83afdc1227aa23cac0778cdd2cc0",
    "id": null,
    "metadata": {},
    "name": "UpdateFrameworkViewUpdateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateFrameworkViewUpdateFrameworkMutation(\n  $input: UpdateFrameworkInput!\n) {\n  updateFramework(input: $input) {\n    framework {\n      id\n      name\n      description\n      version\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6dfde24d73c2cbc0c5ca147d076fbd26";

export default node;
