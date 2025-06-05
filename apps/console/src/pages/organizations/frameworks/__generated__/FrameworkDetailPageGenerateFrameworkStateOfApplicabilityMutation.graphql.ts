/**
 * @generated SignedSource<<bcdaed0c84805f387ee7d1de8ece0068>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation$variables = {
  frameworkId: string;
};
export type FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation$data = {
  readonly generateFrameworkStateOfApplicability: {
    readonly downloadUrl: string;
  };
};
export type FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation = {
  response: FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation$data;
  variables: FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "frameworkId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "frameworkId",
            "variableName": "frameworkId"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "GenerateFrameworkStateOfApplicabilityPayload",
    "kind": "LinkedField",
    "name": "generateFrameworkStateOfApplicability",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "downloadUrl",
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
    "name": "FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "338cbffe84fb19cdf46c97b739216342",
    "id": null,
    "metadata": {},
    "name": "FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation",
    "operationKind": "mutation",
    "text": "mutation FrameworkDetailPageGenerateFrameworkStateOfApplicabilityMutation(\n  $frameworkId: ID!\n) {\n  generateFrameworkStateOfApplicability(input: {frameworkId: $frameworkId}) {\n    downloadUrl\n  }\n}\n"
  }
};
})();

(node as any).hash = "f5c0a7d2bebedecc3de7d55d52f06cd8";

export default node;
