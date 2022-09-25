import express, { Request, Response } from "express";
import supertest from "supertest";
import { applyTraceMiddleware } from "../traceMiddleware";
import { logger } from "@link1900/node-logger-api";

const HEADER_CUSTOM = "x-test-header";

function fakeControllerForLoggerTesting(req: Request, res: Response) {
  const logResult = logger.info(req.originalUrl);
  const logObject = logResult ? JSON.parse(logResult) : {};
  res.json(logObject);
}

/**
 * Delayed controller is need to test concurrency
 */
async function fakeControllerForDelayedLogger(req: Request, res: Response) {
  const logResult = logger.info(req.originalUrl);
  await new Promise(resolver => setTimeout(resolver, Math.random() * 100));
  const logObject = logResult ? JSON.parse(logResult) : {};
  res.json(logObject);
}

function getExpressApp() {
  const app = express();

  app.get(
    "/customHeaders",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM]
    }),
    fakeControllerForLoggerTesting
  );

  app.get(
    "/noTraceHeaderInLog",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM],
      addTraceToLogs: false
    }),
    fakeControllerForLoggerTesting
  );

  app.get(
    "/traceLogCustomField",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM],
      logMetaDataField: "extraTrace"
    }),
    fakeControllerForLoggerTesting
  );

  app.get(
    "/ignoreTraceForPath",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM],
      ignoredPaths: ["/ignoreTraceForPath"]
    }),
    fakeControllerForLoggerTesting
  );

  app.get(
    "/noRequestId",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM],
      addRequestId: false
    }),
    fakeControllerForLoggerTesting
  );

  app.get(
    "/delayTest",
    applyTraceMiddleware({
      traceHeaders: [HEADER_CUSTOM]
    }),
    fakeControllerForDelayedLogger
  );

  return app;
}

describe("traceMiddleware", () => {
  it("should apply customer trace headers to logs", async () => {
    const result = await supertest(await getExpressApp())
      .get("/customHeaders")
      .set("Content-Type", "application/json")
      .set(HEADER_CUSTOM, "custom id")
      .set("other-header", "some other header");

    const { body } = result;

    expect(body.level).toEqual("info");
    expect(body[HEADER_CUSTOM]).toEqual("custom id");
    expect(body["other-header"]).toBeFalsy();
  });

  it("should not have trace ids in logs when disabled", async () => {
    const result = await supertest(await getExpressApp())
      .get("/noTraceHeaderInLog")
      .set("Content-Type", "application/json")
      .set(HEADER_CUSTOM, "example id");

    const { body } = result;

    expect(body[HEADER_CUSTOM]).toBeFalsy();
  });

  it("should put the logs in a custom field", async () => {
    const result = await supertest(await getExpressApp())
      .get("/traceLogCustomField")
      .set("Content-Type", "application/json")
      .set(HEADER_CUSTOM, "example id");

    const { body } = result;

    expect(body["extraTrace"][HEADER_CUSTOM]).toEqual("example id");
  });

  it("should have a trace id for an ignored path", async () => {
    const result = await supertest(await getExpressApp())
      .get("/ignoreTraceForPath")
      .set("Content-Type", "application/json")
      .set(HEADER_CUSTOM, "example id");

    const { body } = result;

    expect(body[HEADER_CUSTOM]).toBeFalsy();
  });

  it("should not have request id when disabled", async () => {
    const result = await supertest(await getExpressApp())
      .get("/noRequestId")
      .set("Content-Type", "application/json")
      .set(HEADER_CUSTOM, "example id");

    const { body } = result;

    expect(body["requestId"]).toBeFalsy();
  });

  it("should log different trace ids for concurrent requests", async () => {
    const results = await Promise.all(
      [0, 1, 2, 3, 4].map(async requestId => {
        return supertest(await getExpressApp())
          .get("/delayTest")
          .set("Content-Type", "application/json")
          .set(HEADER_CUSTOM, `example id ${requestId}`);
      })
    );

    results.forEach((result, index) => {
      const { body } = result;
      // check that log has the correct level
      expect(body.level).toEqual("info");

      // check the log has the correct trace id for the numbered request
      expect(body[HEADER_CUSTOM]).toEqual(`example id ${index}`);
    });
  });
});
