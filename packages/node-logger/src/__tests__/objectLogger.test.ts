import { ObjectLogger } from "../objectLogger";
import testStrings from "./testStrings.json";

enum ExampleEnum {
  ERROR_ONE = "error one",
}

class ExampleError extends Error {
  public code: ExampleEnum;
  public httpCode: string;
  public invalidField: string;
  public invalidReason: string;

  constructor(
    message: string,
    code: ExampleEnum,
    httpCode: string,
    invalidField: string,
    invalidReason: string
  ) {
    super(message);
    this.code = code;
    this.httpCode = httpCode;
    this.invalidField = invalidField;
    this.invalidReason = invalidReason;
  }
}

describe("ObjectLogger", () => {
  describe("constructor()", () => {
    it("builds the object logger correctly", () => {
      const logger = new ObjectLogger();
      expect(logger).toBeTruthy();
      expect(logger.enabled).toEqual(true);
    });
  });

  describe("formatMessage()", () => {
    it("formats basic message correctly correctly", () => {
      const logger = new ObjectLogger();
      const stringResult = logger.formatMessage("info", "test message", {});
      const result = JSON.parse(stringResult);
      expect(result.message).toEqual("test message");
      expect(result.level).toEqual("info");
      expect(result.timestamp).toBeTruthy();
    });

    it("formats with included meta data", () => {
      const logger = new ObjectLogger();
      const stringResult = logger.formatMessage("info", "test message", {
        extra: "data",
      });
      const result = JSON.parse(stringResult);
      expect(result.extra).toEqual("data");
    });

    it("formats hook meta data", () => {
      const logger = new ObjectLogger();
      logger.addMetaHook(() => ({ hook: "data" }));
      const stringResult = logger.formatMessage("info", "test message", {});
      const result = JSON.parse(stringResult);
      expect(result.hook).toEqual("data");
    });

    it("allows logs of up to 10k", () => {
      const logger = new ObjectLogger();
      const stringResult = logger.formatMessage("info", testStrings["9k"], {});
      expect(stringResult).toHaveLength(9248);
    });

    it("allows logs of up to 20k", () => {
      const logger = new ObjectLogger();
      const stringResult = logger.formatMessage("info", testStrings["20k"], {});
      expect(stringResult).toHaveLength(20468);
    });
  });

  it("logs info correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "info");
    const logResult = logger.info("info message", { extra: "data" });
    const result = JSON.parse(logResult!);
    expect(result && result.level).toEqual("info");
    expect(result && result.message).toEqual("info message");
    expect(result && result.extra).toEqual("data");
    expect(mock).toHaveBeenCalled();
  });

  it("logs warn correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "warn");
    const logResult = logger.warn("warn message", { extra: "data" });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("warn");
    expect(result && result.message).toEqual("warn message");
    expect(result && result.extra).toEqual("data");
  });

  it("logs error correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "error");
    const logResult = logger.error("error message", new Error("some error"), {
      extra: "data",
    });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("error");
    expect(result && result.message).toEqual("error message");
    expect(result && result.extra).toEqual("data");
    expect(result && result.error.type).toEqual("Error");
    expect(result && result.error.message).toEqual("some error");
    expect(result && result.error.stacktrace).toBeTruthy();
  });

  it("logs example error with extra information", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "error");
    const exampleError = new ExampleError(
      "extra error",
      ExampleEnum.ERROR_ONE,
      "404",
      "name",
      "too long"
    );
    const logResult = logger.error("error message", exampleError, {
      extra: "data",
    });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("error");
    expect(result && result.message).toEqual("error message");
    expect(result && result.extra).toEqual("data");
    expect(result && result.error.type).toEqual("Error");
    expect(result && result.error.message).toEqual("extra error");
    expect(result && result.error.stacktrace).toBeTruthy();
  });

  it("logs error correctly with meta", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "error");
    const logResult = logger.error("error message");
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("error");
    expect(result && result.message).toEqual("error message");
  });

  it("logs error correctly without error", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "error");
    const logResult = logger.error("error message", undefined, {
      extra: "data",
    });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("error");
    expect(result && result.message).toEqual("error message");
    expect(result && result.extra).toEqual("data");
  });

  it("logs trace correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "trace");
    const logResult = logger.trace("trace message", { extra: "data" });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("trace");
    expect(result && result.message).toEqual("trace message");
    expect(result && result.extra).toEqual("data");
  });

  it("logs debug correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "debug");
    const logResult = logger.debug("debug message", { extra: "data" });
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("debug");
    expect(result && result.message).toEqual("debug message");
    expect(result && result.extra).toEqual("data");
  });

  it("logs correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "log");
    const logResult = logger.log("info", "log message");
    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("info");
    expect(result && result.timestamp).toBeTruthy();
    expect(result && result.trace).toBeFalsy();
  });

  it("does not log if disabled", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "formatMessage");
    logger.enabled = false;
    const logResult = logger.log("info", "log message");
    expect(mock).not.toHaveBeenCalled();
    expect(logResult).toBeFalsy();
  });

  it("logs only the correct level", () => {
    const logger = new ObjectLogger();
    const mockLog = jest.spyOn(console, "log");
    const mockWarn = jest.spyOn(console, "warn");
    logger.level = "warn";
    expect(logger.level).toEqual("warn");
    logger.warn("warn message");
    expect(mockWarn).toHaveBeenCalled();
    logger.info("info message");
    expect(mockLog).not.toHaveBeenCalled();
  });

  it("gets log level correctly", () => {
    const logger = new ObjectLogger();
    logger.level = "trace";
    expect(logger.level).toEqual("trace");

    logger.level = "debug";
    expect(logger.level).toEqual("debug");

    logger.level = "info";
    expect(logger.level).toEqual("info");

    logger.level = "warn";
    expect(logger.level).toEqual("warn");

    logger.level = "error";
    expect(logger.level).toEqual("error");

    logger.innerLogger.setLevel("silent");
    expect(logger.level).toEqual("silent");
  });

  it("adds hook correctly", () => {
    const logger = new ObjectLogger();
    expect(logger.metaHooks.length).toEqual(0);
    logger.addMetaHook(() => ({ some: "value" }));
    expect(logger.metaHooks.length).toEqual(1);
  });

  it("clears hooks correctly", () => {
    const logger = new ObjectLogger();
    expect(logger.metaHooks.length).toEqual(0);
    logger.addMetaHook(() => ({ some: "value" }));
    logger.addMetaHook(() => ({ some: "value2" }));
    expect(logger.metaHooks.length).toEqual(2);
    logger.clearMetaHooks();
    expect(logger.metaHooks.length).toEqual(0);
  });

  it("builds meta data from hooks correctly", () => {
    const logger = new ObjectLogger();
    logger.addMetaHook(() => ({ some: "value" }));
    logger.addMetaHook(() => ({ some: "value2" }));
    logger.addMetaHook(() => ({ more: "value3" }));
    expect(logger.getMetaDataForHooks()).toEqual({
      some: "value2",
      more: "value3",
    });
  });

  it("builds meta data from hooks when no hooks are defined", () => {
    const logger = new ObjectLogger();
    expect(logger.getMetaDataForHooks()).toEqual({});
  });

  it("logs messages with the hook metadata", () => {
    const logger = new ObjectLogger();
    logger.addMetaHook(() => ({ some: "value" }));
    logger.addMetaHook(() => ({ some: "value2" }));
    logger.addMetaHook(() => ({ more: "value3" }));
    const mock = jest.spyOn(logger, "formatMessage");

    const logResult = logger.log("info", "log message");

    const result = JSON.parse(logResult!);
    expect(mock).toHaveBeenCalled();
    expect(result && result.level).toEqual("info");
    expect(result && result.timestamp).toBeTruthy();
    expect(result && result.some).toEqual("value2");
    expect(result && result.more).toEqual("value3");
  });

  it("logs context correctly", () => {
    const logger = new ObjectLogger({ context: { extraContext: "data1" } });
    const mock = jest.spyOn(logger, "info");
    const logResult = logger.info("info message", { extra: "data2" });
    const result = JSON.parse(logResult!);
    expect(result.level).toEqual("info");
    expect(result.message).toEqual("info message");
    expect(result.extra).toEqual("data2");
    expect(result.extraContext).toEqual("data1");
    expect(mock).toHaveBeenCalled();
  });

  it("logs context correctly after update", () => {
    const logger = new ObjectLogger({ context: { extraContext: "data1" } });
    logger.updateContext({ moreContext: "data3" });
    const mock = jest.spyOn(logger, "info");
    const logResult = logger.info("info message", { extra: "data2" });
    const result = JSON.parse(logResult!);
    expect(result.level).toEqual("info");
    expect(result.message).toEqual("info message");
    expect(result.extra).toEqual("data2");
    expect(result.extraContext).toEqual("data1");
    expect(result.moreContext).toEqual("data3");
    expect(mock).toHaveBeenCalled();
  });

  it("logs a circular meta data correctly", () => {
    const mockLog = jest.spyOn(console, "info");
    const logger = new ObjectLogger();
    const circular: any = { field: undefined };
    circular.field = circular;
    logger.info("bad log", circular);

    expect(mockLog).toHaveBeenCalled();
    const call = mockLog.mock.calls[0][0];
    const result = JSON.parse(call);
    expect(result.message).toEqual("bad log");
    expect(result.field.field).toEqual("[Circular ~.field]");
  });

  it("logs a circular error correctly", () => {
    const mockLog = jest.spyOn(console, "error");
    const logger = new ObjectLogger();
    const circular: any = { field: undefined };
    circular.field = circular;
    const circleError: any = new Error("some error");
    circleError.field = circleError;
    logger.error("bad log", circleError, circular);

    expect(mockLog).toHaveBeenCalled();
    const call = mockLog.mock.calls[0][0];
    const result = JSON.parse(call);
    expect(result.message).toEqual("bad log");
    expect(result.field.field).toEqual("[Circular ~.field]");
  });
});
