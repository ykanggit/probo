/**
 * @generated SignedSource<<783f49ea256cdc5ce07fac0c8f16010c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MeasureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type TaskState = "DONE" | "TODO";
import { FragmentRefs } from "relay-runtime";
export type MeasuresPageFragment$data = {
  readonly id: string;
  readonly measures: {
    readonly __id: string;
    readonly completedCount: number;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly category: string;
        readonly controls: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly exclusionJustification: string | null | undefined;
              readonly framework: {
                readonly name: string;
                readonly referenceId: string;
              };
              readonly sectionTitle: string;
            };
          }>;
        };
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly referenceId: string;
        readonly state: MeasureState;
        readonly tasks: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly description: string;
              readonly id: string;
              readonly name: string;
              readonly referenceId: string;
              readonly state: TaskState;
            };
          }>;
        };
        readonly " $fragmentSpreads": FragmentRefs<"MeasureFormDialogMeasureFragment">;
      };
    }>;
    readonly inProgressCount: number;
    readonly notApplicableCount: number;
    readonly notStartedCount: number;
    readonly totalCount: number;
  };
  readonly " $fragmentType": "MeasuresPageFragment";
};
export type MeasuresPageFragment$key = {
  readonly " $data"?: MeasuresPageFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MeasuresPageFragment">;
};

import MeasuresPageFragment_query_graphql from './MeasuresPageFragment_query.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "measures"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "referenceId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "after"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "before"
    },
    {
      "defaultValue": 100,
      "kind": "LocalArgument",
      "name": "first"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "last"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "order"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "bidirectional",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": {
          "count": "last",
          "cursor": "before"
        },
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": MeasuresPageFragment_query_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "MeasuresPageFragment",
  "selections": [
    {
      "alias": "measures",
      "args": [
        {
          "kind": "Variable",
          "name": "orderBy",
          "variableName": "order"
        }
      ],
      "concreteType": "MeasureConnection",
      "kind": "LinkedField",
      "name": "__MeasuresPageFragment_measures_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "notStartedCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inProgressCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "notApplicableCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "completedCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "MeasureEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Measure",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                (v2/*: any*/),
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "category",
                  "storageKey": null
                },
                (v4/*: any*/),
                (v5/*: any*/),
                {
                  "alias": null,
                  "args": (v6/*: any*/),
                  "concreteType": "ControlConnection",
                  "kind": "LinkedField",
                  "name": "controls",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "ControlEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Control",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "sectionTitle",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "exclusionJustification",
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "Framework",
                              "kind": "LinkedField",
                              "name": "framework",
                              "plural": false,
                              "selections": [
                                (v3/*: any*/),
                                (v2/*: any*/)
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "controls(first:1)"
                },
                {
                  "alias": null,
                  "args": (v6/*: any*/),
                  "concreteType": "TaskConnection",
                  "kind": "LinkedField",
                  "name": "tasks",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "TaskEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Task",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            (v1/*: any*/),
                            (v2/*: any*/),
                            (v3/*: any*/),
                            (v5/*: any*/),
                            (v4/*: any*/)
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "tasks(first:1)"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "MeasureFormDialogMeasureFragment"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasPreviousPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "startCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": null
    },
    (v1/*: any*/)
  ],
  "type": "Organization",
  "abstractKey": null
};
})();

(node as any).hash = "fb9c874696923e1844c9ca5c44f83eb1";

export default node;
