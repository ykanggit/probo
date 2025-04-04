/**
 * @generated SignedSource<<eccd1c8953dd5a4b93817a53ed43e3c4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateFrameworkInput = {
  description?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
};
export type EditFrameworkViewUpdateFrameworkMutation$variables = {
  input: UpdateFrameworkInput;
};
export type EditFrameworkViewUpdateFrameworkMutation$data = {
  readonly updateFramework: {
    readonly framework: {
      readonly description: string;
      readonly id: string;
      readonly name: string;
    };
  };
};
export type EditFrameworkViewUpdateFrameworkMutation = {
  response: EditFrameworkViewUpdateFrameworkMutation$data;
  variables: EditFrameworkViewUpdateFrameworkMutation$variables;
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
    "name": "EditFrameworkViewUpdateFrameworkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditFrameworkViewUpdateFrameworkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "672c40ecde91237ef059320284b9d1c6",
    "id": null,
    "metadata": {},
    "name": "EditFrameworkViewUpdateFrameworkMutation",
    "operationKind": "mutation",
    "text": "mutation EditFrameworkViewUpdateFrameworkMutation(\n  $input: UpdateFrameworkInput!\n) {\n  updateFramework(input: $input) {\n    framework {\n      id\n      name\n      description\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8fe1fd5bf26bce25a31cb724bcedec9f";

export default node;
