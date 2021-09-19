import { ObjectLogger } from "../objectLogger";

enum ExampleEnum {
  ERROR_ONE = "error one",
}

class ExampleError extends Error {
  public code: ExampleEnum;
  public httpCode: string;
  public invalidField: string;
  public invalidReason: string;

  constructor(message: string, code: ExampleEnum, httpCode: string, invalidField: string, invalidReason: string) {
    super(message);
    this.code = code;
    this.httpCode = httpCode;
    this.invalidField = invalidField;
    this.invalidReason = invalidReason;
  }
}

describe("ObjectLogger", () => {
  it("logs info correctly", () => {
    const logger = new ObjectLogger();
    const mock = jest.spyOn(logger, "info");
    const logResult = logger.info("info message", { extra: "data" });
    const result = JSON.parse(logResult!);
    expect(result.level).toEqual("info");
    expect(result.message).toEqual("info message");
    expect(result.extra).toEqual("data");
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
    const logResult = logger.error("error message", new Error("some error"), { extra: "data" });
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
    const exampleError = new ExampleError("extra error", ExampleEnum.ERROR_ONE, "404", "name", "too long");
    const logResult = logger.error("error message", exampleError, { extra: "data" });
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
    const logResult = logger.error("error message", undefined, { extra: "data" });
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
    expect(logger.level).toEqual("info");
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
});
