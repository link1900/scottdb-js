import { DocumentNode, print } from "graphql";
import {
  makeValidJsonRequest,
  ValidJsonRequestOptions,
} from "@link1900/node-http-client";
import { logger } from "@link1900/node-logger";
import { getOperationNameFromGraphqlQueryString } from "../common/graphqlHelper";
import { GraphqlErrorResponse } from "./GraphqlErrorResponse";
import { ExternalGraphqlApiError } from "./ExternalGraphqlApiError";
import { HttpStatusCode } from "@link1900/node-error";

export interface GraphqlRequestOptions
  extends Omit<ValidJsonRequestOptions, "body"> {
  url: string;
  query: string;
  variables?: object;
}

export interface GraphqlRequestResponse<TData> {
  data?: TData;
  errors?: GraphqlErrorResponse[];
}

export interface GraphqlQueryOptions<TVars>
  extends Omit<GraphqlRequestOptions, "query" | "variables"> {
  query: DocumentNode | string;
  variables?: TVars;
}

export async function makeValidGraphqlRequest<TData>(
  options: GraphqlRequestOptions
): Promise<GraphqlRequestResponse<TData>> {
  const { url, query, variables, ...rest } = options;
  return await makeValidJsonRequest<GraphqlRequestResponse<TData>>({
    method: "POST",
    url,
    body: {
      query,
      variables,
    },
    ...rest,
  });
}

export async function makeValidGraphqlQuery<
  TData extends object,
  TVars extends object | undefined
>(options: GraphqlQueryOptions<TVars>): Promise<TData> {
  const { query, ...requestOptions } = options;
  const queryString = typeof query !== "string" ? print(query) : query;
  const queryName = getOperationNameFromGraphqlQueryString(queryString);
  logger.info("Making external request to graphql api", {
    queryName,
  });
  const { data, errors } = await makeValidGraphqlRequest<TData>({
    query: queryString,
    ...requestOptions,
  });

  if (errors && errors.length > 0) {
    const externalMessage = errors[0]?.message ?? "";
    throw new ExternalGraphqlApiError({
      message: "graphql api returned errors",
      externalHttpCode: HttpStatusCode.OK_200,
      externalMessage,
      externalGraphqlErrors: errors,
      graphqlErrorType: "resolver",
    });
  }

  if (!data) {
    throw new ExternalGraphqlApiError({
      message: "graphql api returned response without data",
      externalHttpCode: HttpStatusCode.OK_200,
      graphqlErrorType: "resolver",
    });
  }

  return data;
}
