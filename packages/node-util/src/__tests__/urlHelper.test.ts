import { buildUrl } from "../urlHelper";
import { ErrorCode } from "@link1900/node-error";

describe("urlHelper", () => {
  describe("#buildUrl", () => {
    it("builds the url correctly", async () => {
      const url = "https://maps.googleapis.com/maps/api/geo code/json";
      const params = {
        key: "123 key",
        address: "#8/196 Alma Road North Perth 6006 AUS",
      };
      const result = buildUrl(url, params);
      expect(result).toEqual(
        "https://maps.googleapis.com/maps/api/geo%20code/json?address=%238%2F196%20Alma%20Road%20North%20Perth%206006%20AUS&key=123%20key"
      );
    });

    it("builds the url correctly with params", async () => {
      const url = "https://maps.googleapis.com/maps/api/geo code/json";
      const result = buildUrl(url);
      expect(result).toEqual(
        "https://maps.googleapis.com/maps/api/geo%20code/json"
      );
    });

    it("throws error for url of undefined", async () => {
      try {
        // @ts-ignore
        buildUrl();
        expect(true).toEqual(false);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });

    it("throws error for null url with valid params", async () => {
      try {
        // @ts-ignore
        buildUrl(null, { key: "123 key" });
        expect(true).toEqual(false);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });

    it("throws error for invalid url object", async () => {
      try {
        // @ts-ignore
        buildUrl({});
        expect(true).toEqual(false);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });

    it("throws error for url of invalid url", async () => {
      try {
        const url = "maps.googleapis.com/maps/api/geo";
        buildUrl(url);
        expect(true).toEqual(false);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
