/**
 * @generated SignedSource<<0c1d84470c9beda41d05161fad1608f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTier = "CRITICAL" | "GENERAL" | "SIGNIFICANT";
export type ServiceCriticality = "HIGH" | "LOW" | "MEDIUM";
export type UpdateVendorInput = {
  description?: string | null | undefined;
  expectedVersion: number;
  id: string;
  name?: string | null | undefined;
  privacyPolicyUrl?: string | null | undefined;
  riskTier?: RiskTier | null | undefined;
  serviceCriticality?: ServiceCriticality | null | undefined;
  serviceStartAt?: any | null | undefined;
  serviceTerminationAt?: any | null | undefined;
  statusPageUrl?: string | null | undefined;
  termsOfServiceUrl?: string | null | undefined;
};
export type VendorOverviewPageUpdateVendorMutation$variables = {
  input: UpdateVendorInput;
};
export type VendorOverviewPageUpdateVendorMutation$data = {
  readonly updateVendor: {
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly privacyPolicyUrl: string | null | undefined;
    readonly riskTier: RiskTier;
    readonly serviceCriticality: ServiceCriticality;
    readonly serviceStartAt: any;
    readonly serviceTerminationAt: any | null | undefined;
    readonly statusPageUrl: string | null | undefined;
    readonly termsOfServiceUrl: string | null | undefined;
    readonly updatedAt: any;
    readonly version: number;
  };
};
export type VendorOverviewPageUpdateVendorMutation = {
  response: VendorOverviewPageUpdateVendorMutation$data;
  variables: VendorOverviewPageUpdateVendorMutation$variables;
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
    "concreteType": "Vendor",
    "kind": "LinkedField",
    "name": "updateVendor",
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
        "name": "serviceStartAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "serviceTerminationAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "serviceCriticality",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "riskTier",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "statusPageUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "termsOfServiceUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "privacyPolicyUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
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
    "name": "VendorOverviewPageUpdateVendorMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VendorOverviewPageUpdateVendorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d0dd4f7b7219b20cc57a57e25b2b1197",
    "id": null,
    "metadata": {},
    "name": "VendorOverviewPageUpdateVendorMutation",
    "operationKind": "mutation",
    "text": "mutation VendorOverviewPageUpdateVendorMutation(\n  $input: UpdateVendorInput!\n) {\n  updateVendor(input: $input) {\n    id\n    name\n    description\n    serviceStartAt\n    serviceTerminationAt\n    serviceCriticality\n    riskTier\n    statusPageUrl\n    termsOfServiceUrl\n    privacyPolicyUrl\n    updatedAt\n    version\n  }\n}\n"
  }
};
})();

(node as any).hash = "be093542424cdd4a329ec389312d0f83";

export default node;
