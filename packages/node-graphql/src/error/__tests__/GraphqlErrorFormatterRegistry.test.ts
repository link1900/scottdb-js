import { GraphqlErrorFormatterRegistry } from "../GraphqlErrorFormatterRegistry";
import { GraphqlJavascriptErrorFormatter } from "../GraphqlJavascriptErrorFormatter";
import { GraphqlServerErrorFormatter } from "../GraphqlServerErrorFormatter";

describe("GraphqlErrorFormatterRegistry", () => {
  it("adds a new formatter", () => {
    const registry = new GraphqlErrorFormatterRegistry();
    registry.addFormatter(new GraphqlJavascriptErrorFormatter());
    expect(registry.formatters).toHaveLength(1);
  });

  it("add multiple new formatters", () => {
    const registry = new GraphqlErrorFormatterRegistry();
    registry.addFormatters([
      new GraphqlJavascriptErrorFormatter(),
      new GraphqlServerErrorFormatter(),
    ]);
    expect(registry.formatters).toHaveLength(2);
  });

  it("add multiple new formatters", () => {
    const registry = new GraphqlErrorFormatterRegistry();
    registry.addFormatters([
      new GraphqlJavascriptErrorFormatter(),
      new GraphqlServerErrorFormatter(),
    ]);
    expect(registry.formatters).toHaveLength(2);
  });

  it("add multiple new formatters via constructor", () => {
    const registry = new GraphqlErrorFormatterRegistry([
      new GraphqlJavascriptErrorFormatter(),
      new GraphqlServerErrorFormatter(),
    ]);
    expect(registry.formatters).toHaveLength(2);
  });

  it("remove formatter", () => {
    const formatter = new GraphqlJavascriptErrorFormatter();
    const registry = new GraphqlErrorFormatterRegistry([formatter]);
    expect(registry.formatters).toHaveLength(1);
    registry.removeFormatter(formatter);
    expect(registry.formatters).toHaveLength(0);
  });

  it("remove formatter by id", () => {
    const formatter = new GraphqlJavascriptErrorFormatter();
    const registry = new GraphqlErrorFormatterRegistry([formatter]);
    expect(registry.formatters).toHaveLength(1);
    registry.removeFormatterById(formatter.id);
    expect(registry.formatters).toHaveLength(0);
  });

  it("removes all formatters", () => {
    const formatter = new GraphqlJavascriptErrorFormatter();
    const registry = new GraphqlErrorFormatterRegistry([formatter]);
    expect(registry.formatters).toHaveLength(1);
    registry.clearFormatters();
    expect(registry.formatters).toHaveLength(0);
  });

  it("formats error by formatters", () => {
    const formatter = new GraphqlJavascriptErrorFormatter();
    const registry = new GraphqlErrorFormatterRegistry([formatter]);
    const result = registry.formatError({
      message: "some error",
      originalError: new Error("some bad error"),
      extensions: {},
    });
    expect(result.message).toEqual("some error");
    expect(result.extensions.code).toEqual("INTERNAL_SERVER_ERROR");
    expect(result.extensions.errorId).toHaveLength(36);
    expect(result.extensions.errorMessage).toEqual("some bad error");
    expect(result.extensions.httpStatusCode).toEqual(500);
    expect(result.extensions.stacktrace).not.toBeUndefined();
  });
});
