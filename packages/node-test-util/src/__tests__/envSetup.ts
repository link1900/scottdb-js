import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server-express";
import express, { Express } from "express";
import { buildSchema } from "type-graphql";
import {
  setTestContextProvider,
  setTestSchemaProvider,
} from "../graphqlTestHelper";
import { setTestServerProvider } from "../serverTestHelper";
import { BookResolver } from "./testGraphqlType";

export async function createExpressApp(): Promise<Express> {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ running: true });
  });

  app.get("/bad", (req, res) => {
    res.status(400).json({ ok: false });
  });

  app.delete("/remove", (req, res) => {
    res.json({ ok: true });
  });

  app.post("/update", (req, res) => {
    res.json({ ok: true });
  });

  const apolloServer = new ApolloServer({
    typeDefs: gql`
      type Info {
        uptime: Int
      }

      type Query {
        health: Boolean
        info: Info
      }
    `,
    resolvers: {
      Query: {
        health: () => true,
        info: () => {
          return {
            uptime: 5,
          };
        },
      },
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  return app;
}

export async function createTestSchema() {
  return await buildSchema({
    resolvers: [BookResolver],
  });
}

beforeAll(async () => {
  setTestServerProvider(createExpressApp);
  setTestSchemaProvider(createTestSchema);
  setTestContextProvider(async () => {
    return {};
  });
});
