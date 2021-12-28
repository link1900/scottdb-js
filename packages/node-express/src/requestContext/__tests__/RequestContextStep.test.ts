import { requestContextStep } from "../RequestContextStep";

const exampleContextWithId: any = {
  express: {
    req: {
      requestId: "123",
    },
  },
};

const exampleContextWithoutId: any = {};

describe("RequestContextStep", () => {
  it("build request context with passed id", async () => {
    const result = await requestContextStep.run(exampleContextWithId);
    expect(result).toEqual({
      express: {
        req: {
          requestId: "123",
        },
      },
      requestId: "123",
    });
  });

  it("build request context with new uuid", async () => {
    const result = await requestContextStep.run(exampleContextWithoutId);
    expect(result?.requestId).toHaveLength(36);
  });
});
