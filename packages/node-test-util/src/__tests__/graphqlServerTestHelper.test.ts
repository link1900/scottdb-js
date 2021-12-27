import {
  buildApiQueryFunction,
  callGraphqlEndpoint,
} from "../graphqlServerTestHelper";

describe("graphqlServerTestHelper", () => {
  describe("callGraphqlEndpoint()", () => {
    it("returns the correct response from the server", async () => {
      const result = await callGraphqlEndpoint({
        query: `
        query {
          health
        }
      `,
        variables: {},
      });
      const { data } = result;
      expect(data).toEqual({ health: true });
    });
  });

  describe("buildApiQueryFunction()", () => {
    it("returns the correct response from the server", async () => {
      const query = await buildApiQueryFunction(
        `
        query {
          info {
            uptime
          }
        }
      `,
        "info"
      );
      const info = await query({});
      expect(info).toEqual({ uptime: 5 });
    });
  });
});
