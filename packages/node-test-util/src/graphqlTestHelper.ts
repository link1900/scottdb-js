import assert from "assert";
import {
  DocumentNode,
  ExecutionResult,
  graphql,
  GraphQLSchema,
  print,
} from "graphql";
import { get, has } from "lodash";

type SchemaProvider = () => Promise<GraphQLSchema>;
type ContextProvider = () => Promise<any>;

let graphqlSchema: GraphQLSchema | undefined;
let schemaProvider: SchemaProvider | undefined;
let contextProvider: ContextProvider | undefined;

export function setTestSchemaProvider(provider: SchemaProvider) {
  schemaProvider = provider;
}

export function setTestContextProvider(provider: ContextProvider) {
  contextProvider = provider;
}

async function getTestGraphqlSchema() {
  if (!graphqlSchema) {
    if (!schemaProvider) {
      throw new Error(
        "Need to call setSchemaProvider() before calling getTestGraphqlSchema()"
      );
    }
    graphqlSchema = await schemaProvider();
  }
  return graphqlSchema;
}

export function setTestGraphqlSchema(schema: GraphQLSchema) {
  graphqlSchema = schema;
}

export async function callGraphqlWithSchema(
  query: string,
  variables: object,
  someSchema: GraphQLSchema,
  context: any
) {
  return graphql(someSchema, query, context, context, variables);
}

export function checkResultForGraphqlError(
  result: ExecutionResult,
  expectError: boolean
) {
  const errors = result?.errors ?? [];
  const hasGraphqlErrors = errors.length > 0;
  if (expectError) {
    assert(
      hasGraphqlErrors,
      `Expected graphql call to return graphql errors and no errors were found. Result: ${JSON.stringify(
        result
      )}.`
    );
  } else {
    assert(
      !hasGraphqlErrors,
      `Expected graphql call to not return errors but errors were found. \nErrors: ${JSON.stringify(
        errors
      )}`
    );
  }
}

export async function runQuery(
  query: string,
  resultKey: string,
  variables: object,
  providedContext: any,
  expectError: boolean = false
) {
  if (!schemaProvider) {
    throw new Error("call setTestSchemaProvider() before using runQuery");
  }
  const schema = await getTestGraphqlSchema();
  const result = await callGraphqlWithSchema(
    query,
    variables,
    schema,
    providedContext
  );
  checkResultForGraphqlError(result, expectError);

  if (expectError) {
    const { errors = [] } = result;
    return errors[0];
  }

  const { data } = result;

  if (!data || !has(data, resultKey)) {
    throw new Error("Cannot find result data");
  }
  return get(data, resultKey);
}

export function buildQueryFunction(
  query: string | DocumentNode,
  resultKey: string
) {
  const queryString = typeof query === "string" ? query : print(query);
  return async function queryFunction(
    variables: object = {},
    providedContext?: any,
    expectedError: boolean = false
  ) {
    let theContext;
    if (providedContext === undefined) {
      if (!contextProvider) {
        throw new Error(
          "call setTestContextProvider() before calling buildQueryFunction()"
        );
      } else {
        theContext = contextProvider();
      }
    } else {
      theContext = providedContext;
    }

    return runQuery(
      queryString,
      resultKey,
      variables,
      theContext,
      expectedError
    );
  };
}
