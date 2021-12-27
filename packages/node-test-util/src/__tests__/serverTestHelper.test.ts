import {
  callDeleteEndpoint,
  callGetEndpoint,
  callOptionsEndpoint,
  callPostEndpoint,
} from "../serverTestHelper";

describe("serverTestHelper", () => {
  describe("callGetEndpoint()", () => {
    it("returns the correct response from the server", async () => {
      const result = await callGetEndpoint({ url: "/health" });
      const { body } = result;
      expect(body).toEqual({ running: true });
    });
  });

  describe("callOptionsEndpoint()", () => {
    it("returns the correct response from the server", async () => {
      const result = await callOptionsEndpoint({ url: "/health" });
      const { body } = result;
      expect(body).toEqual({});
    });
  });

  describe("callDeleteEndpoint()", () => {
    it("returns the correct response from the server", async () => {
      const result = await callDeleteEndpoint({ url: "/remove" });
      const { body } = result;
      expect(body).toEqual({ ok: true });
    });
  });

  describe("callPostEndpoint()", () => {
    it("returns the correct response from the server", async () => {
      const result = await callPostEndpoint({ url: "/update" });
      const { body } = result;
      expect(body).toEqual({ ok: true });
    });
  });
});
