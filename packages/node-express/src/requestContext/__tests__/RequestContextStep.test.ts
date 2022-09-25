import { RequestContextStep } from "../RequestContextStep";

const exampleContextWithId: any = {
  express: {
    res: {
      locals: {
        requestId: "123",
      }
    },
  },
};

const exampleContextWithoutId: any = {};

describe("RequestContextStep", () => {
  it("build request context with passed id", async () => {
    const result = await new RequestContextStep().run(exampleContextWithId);
    expect(result).toEqual({
      express: {
        res: {
          locals: {
            requestId: "123",
          }
        },
      },
      requestId: "123",
    });
  });

  it("build request context with new uuid", async () => {
    const result = await new RequestContextStep().run(exampleContextWithoutId);
    expect(result?.requestId).toHaveLength(36);
  });
});
