import { EmptyLogger } from "../EmptyLogger";

describe("EmptyLogger()", () => {
  it("formatMessage()", () => {
    expect(new EmptyLogger().formatMessage("info", "some")).toEqual("");
  });

  it("getMetaDataForHooks()", () => {
    expect(new EmptyLogger().getMetaDataForHooks()).toEqual({});
  });

  it("getLevel()", () => {
    expect(new EmptyLogger().getLevel()).toEqual("silent");
  });

  it("trace()", () => {
    expect(new EmptyLogger().trace("some")).toBeUndefined();
  });

  it("debug()", () => {
    expect(new EmptyLogger().debug("some")).toBeUndefined();
  });

  it("info()", () => {
    expect(new EmptyLogger().info("some")).toBeUndefined();
  });

  it("warn()", () => {
    expect(new EmptyLogger().warn("some")).toBeUndefined();
  });

  it("error()", () => {
    expect(new EmptyLogger().error("some")).toBeUndefined();
  });

  it("log()", () => {
    expect(new EmptyLogger().log("info", "some")).toBeUndefined();
  });
});
