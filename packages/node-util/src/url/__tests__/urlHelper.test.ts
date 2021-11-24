import { addUrlParameters, buildUrl } from "../urlHelper";

describe("urlHelper", () => {
  describe("#addUrlParameters", () => {
    it("add the parameters correctly with and encodes correctly", async () => {
      const url = "https://maps.googleapis.com/maps/api/geo/code/json";
      const params = {
        key: "123 key",
        address: "#8/196 Alma Road North Perth 6006 AUS",
      };
      const result = addUrlParameters(url, params);
      expect(result).toEqual(
        "https://maps.googleapis.com/maps/api/geo/code/json?address=%238%2F196%20Alma%20Road%20North%20Perth%206006%20AUS&key=123%20key"
      );
    });
  });

  describe("#buildUrl", () => {
    it("builds the url correctly", async () => {
      const url = "https://maps.googleapis.com";
      const result = buildUrl({
        origin: url,
        pathParts: ["maps", "api hats", "geo"],
        queryParameters: {
          key: "123 key",
          address: "#8/196 Alma Road North Perth 6006 AUS",
        },
      });
      expect(result).toEqual(
        "https://maps.googleapis.com/maps/api%20hats/geo?address=%238%2F196%20Alma%20Road%20North%20Perth%206006%20AUS&key=123%20key"
      );
    });
  });

  describe("#buildUrl", () => {
    it("builds the url correctly with different query parameter types", async () => {
      const url = "https://maps.googleapis.com/hats";
      const result = buildUrl({
        origin: url,
        queryParameters: {
          number: 1,
          bool: true,
          string: "example",
          array: ["itemOne", "itemTwo"],
          none: undefined,
          nothing: null,
        },
      });
      expect(result).toEqual(
        "https://maps.googleapis.com/hats?array=itemOne&array=itemTwo&bool=true&nothing&number=1&string=example"
      );
    });
  });
});
