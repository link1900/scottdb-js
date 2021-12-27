import { buildQueryFunction, runQuery } from "../graphqlTestHelper";

describe("graphqlTestHelper", () => {
  describe("runQuery()", () => {
    it("returns the correct response from the server", async () => {
      const book = await runQuery(
        `
        query {
          book {
            title
          }
        }
      `,
        "book",
        {},
        {}
      );
      expect(book).toEqual({ title: "test" });
    });
  });

  describe("buildQueryFunction()", () => {
    it("returns the correct response from the server", async () => {
      const query = buildQueryFunction(
        `
        query {
          book {
            title
          }
        }
      `,
        "book"
      );
      const book = await query();
      expect(book).toEqual({ title: "test" });
    });
  });
});
