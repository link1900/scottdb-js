import { logger } from "@link1900/node-logger-api";
import express from "express";
import { applyTraceMiddleware } from "../src";

const app = express();

// call with a header x-od-trace-id
app.get("/example", applyTraceMiddleware(), (req, res) => {
  logger.info("log should have trace ids");
  res.json({ success: true });
});

app.get("/other", (req, res) => {
  logger.info("should NOT have trace ids");
  // this log it will have trace ids included if you call it after call /example
  // this is due to the fact that local context state is being set globally across the routes
  // if this route does not "reset" the global state (by using applyTraceMiddleware itself)
  // then trace ids will remain for any routes without the middleware
  res.json({ success: true });
});

app.listen({ port: 3000 }, () => {
  console.info(`🚀 Server ready`);
});
