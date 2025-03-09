import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { buildEndpoint } from "./utils";

const fetchRelay: FetchFunction = async (
  request,
  variables,
  _,
  uploadables
) => {
  const requestInit: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: {},
  };

  if (uploadables) {
    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        operationName: request.name,
        query: request.text,
        variables: variables,
      })
    );

    const uploadableMap: {
      [key: string]: string[];
    } = {};

    Object.keys(uploadables).forEach((key, index) => {
      uploadableMap[index] = [`variables.${key}`];
    });

    formData.append("map", JSON.stringify(uploadableMap));

    Object.keys(uploadables).forEach((key, index) => {
      formData.append(index.toString(), uploadables[key]);
    });

    requestInit.body = formData;
  } else {
    requestInit.headers = {
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      "Content-Type": "application/json",
    };

    requestInit.body = JSON.stringify({
      operationName: request.name,
      query: request.text,
      variables,
    });
  }

  const response = await fetch(
    buildEndpoint("/api/console/v1/query"),
    requestInit
  );

  const json = await response.json();

  if (Array.isArray(json.errors)) {
    throw new Error(
      `Error fetching GraphQL query '${
        request.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  return json;
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchRelay),
    store: new Store(new RecordSource()),
  });
}

export const RelayEnvironment: Environment = createRelayEnvironment();
