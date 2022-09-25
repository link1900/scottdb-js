import { DocumentNode, print } from "graphql";
import { isObject, isString } from "lodash";
import { logger } from "@link1900/node-logger-api";

export function getOperationNameFromGraphqlQueryString(
  value?: string | null
): string {
  if (!value) {
    return "";
  }
  const found = value.match(/query\s+\w+/g);
  if (!found || found.length === 0 || !found[0]) {
    return "";
  }
  return found[0].split(" ")?.[1] ?? "";
}

export function documentNodeToString(node: DocumentNode) {
  return print(node);
}

export function logGraphqlCall(body?: any) {
  if (!body) {
    return false;
  }

  if (!isObject(body) && isString(body)) {
    body = JSON.parse(body);
  }

  const query = body.query ? clearGraphqlQueryString(body.query) : body.query;

  try {
    const meta = {
      query,
      operationName: body.operationName,
    };
    logger.info(`processing graphql query`, meta);
  } catch (e) {
    logger.error("Error while logging", e);
    return false;
  }
  return true;
}

export function clearGraphqlQueryString(value?: string | null) {
  if (!value) {
    return "";
  }
  return value.replace(/(\\n)+/g, "").replace(/\s+/g, " ");
}
