import { logger } from "@link1900/node-logger-api";
import express from "express";
import { applyTraceMiddleware } from "../src";

const app = express();
app.use(applyTraceMiddleware());

// call with a header x-od-trace-id
app.get("/example", (req, res) => {
  logger.info("log should have trace ids");
  res.json({ success: true });
});

app.listen({ port: 3000 }, () => {
  console.info(`🚀 Server ready`);
});
