import {
  Environment,
  type FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";

import type { PropsWithChildren } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { buildEndpoint } from "./RelayProviders";

export class TrustCenterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TrustCenterError";
  }
}

const fetchTrustRelay: FetchFunction = async (request, variables) => {
  const requestInit: RequestInit = {
    method: "POST",
    headers: {
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify({
      operationName: request.name,
      query: request.text,
      variables,
    }),
  };

  const response = await fetch(
    buildEndpoint("/api/trust/v1/graphql"),
    requestInit
  );

  if (response.status === 500) {
    throw new TrustCenterError("Internal server error");
  }

  const json = await response.json();

  if (json.errors) {
    throw new TrustCenterError(
      `Error fetching GraphQL query '${
        request.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  return json;
};

const trustSource = new RecordSource();
const trustStore = new Store(trustSource, {
  queryCacheExpirationTime: 5 * 60 * 1000, // 5 minutes for trust center content
  gcReleaseBufferSize: 10,
});

export const trustRelayEnvironment = new Environment({
  network: Network.create(fetchTrustRelay),
  store: trustStore,
});

/**
 * Provider for trust center Relay environment (public API)
 */
export function TrustRelayProvider({ children }: PropsWithChildren) {
  return (
    <RelayEnvironmentProvider environment={trustRelayEnvironment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
