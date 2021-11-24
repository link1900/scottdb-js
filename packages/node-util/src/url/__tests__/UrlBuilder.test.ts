import { UrlBuilder, UrlOptions, UrlProperties } from "../UrlBuilder";

function testUrlBuilder(test: {
  props: UrlProperties;
  options?: UrlOptions;
  expected: string;
}) {
  expect(new UrlBuilder(test.props, test.options).toString()).toEqual(
    test.expected
  );
}

describe("UrlBuilder", () => {
  describe("protocol", () => {
    it("builds", () => {
      testUrlBuilder({
        props: { protocol: "https", protocolOrigin: "ftp://" },
        expected: "ftp://",
      });
    });

    it("override protocol", () => {
      testUrlBuilder({
        props: { protocol: "https" },
        expected: "https://",
      });
    });

    it("override protocol separator", () => {
      testUrlBuilder({
        props: { protocolSeparator: ":://" },
        expected: "http:://",
      });
    });
  });

  describe("auth", () => {
    it("builds", () => {
      testUrlBuilder({
        props: { username: "john", password: "secret", authSeparator: "::" },
        expected: "http://john::secret",
      });
    });

    it("auth override", () => {
      testUrlBuilder({
        props: { username: "john", auth: "sam" },
        expected: "http://sam",
      });
    });

    it("username", () => {
      testUrlBuilder({
        props: { username: "john" },
        expected: "http://john",
      });
    });

    it("password", () => {
      testUrlBuilder({
        props: { password: "secret" },
        expected: "http://secret",
      });
    });

    it("username and password", () => {
      testUrlBuilder({
        props: { username: "john", password: "secret" },
        expected: "http://john:secret",
      });
    });
  });

  describe("host", () => {
    it("builds", () => {
      testUrlBuilder({
        props: { hostname: "example.com", port: "3465" },
        expected: "http://example.com:3465",
      });
    });

    it("override", () => {
      testUrlBuilder({
        props: {
          host: "sub.example.com",
          hostname: "example.com",
          port: "3465",
        },
        expected: "http://sub.example.com",
      });
    });

    it("hostname", () => {
      testUrlBuilder({
        props: { hostname: "example.com" },
        expected: "http://example.com",
      });
    });

    it("hostname and path parts", () => {
      testUrlBuilder({
        props: {
          hostname: "example.com",
          pathParts: ["some", "path"],
        },
        expected: "http://example.com/some/path",
      });
    });

    it("hostname and path", () => {
      testUrlBuilder({
        props: {
          hostname: "example.com",
          path: "/some/path",
        },
        expected: "http://example.com/some/path",
      });
    });

    it("port", () => {
      testUrlBuilder({
        props: { port: "3465" },
        expected: "http://3465",
      });
    });
  });

  describe("origin", () => {
    it("builds", () => {
      testUrlBuilder({
        props: {
          protocol: "https",
          protocolSeparator: ":://",
          username: "john",
          password: "secret",
          authSeparator: "::",
          authHostSeparator: "@@",
          hostname: "example.com",
          hostSeparator: "::",
          port: "3465",
        },
        expected: "https:://john::secret@@example.com::3465",
      });
    });

    it("override", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com",
          hostname: "not.example.com",
        },
        expected: "https://example.com",
      });
    });

    it("encode", () => {
      testUrlBuilder({
        props: {
          origin: "https://more example.com",
        },
        expected: "https://more%20example.com",
      });
    });

    it("encoding disabled", () => {
      testUrlBuilder({
        props: {
          origin: "https://more example.com",
        },
        options: {
          encodeOrigin: false,
        },
        expected: "https://more example.com",
      });
    });

    it("auth", () => {
      testUrlBuilder({
        props: {
          username: "john",
          password: "secret",
          hostname: "example.com",
          port: "3465",
        },
        expected: "http://john:secret@example.com:3465",
      });
    });

    it("host", () => {
      testUrlBuilder({
        props: {
          username: "john",
          password: "secret",
          hostname: "example.com",
          port: "3465",
          authHostSeparator: "@@",
        },
        expected: "http://john:secret@@example.com:3465",
      });
    });
  });

  describe("path", () => {
    it("builds", () => {
      testUrlBuilder({
        props: {
          pathParts: ["/first", "second/", "/third", "forth", "/fifth/sixth//"],
        },
        expected: "http:///first/second/third/forth/fifth/sixth//",
      });
    });

    it("encodes", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          pathParts: ["/first part", "second"],
        },
        expected: "http://example.com/first%20part/second",
      });
    });

    it("encoding disabled", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          pathParts: ["/first part", "second"],
        },
        options: {
          encodePath: false,
        },
        expected: "http://example.com/first part/second",
      });
    });

    it("builds with origin", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          pathParts: [
            "/first",
            "second/",
            "/third",
            "/forth/",
            "fifth",
            "/sixth/",
            "seventh/",
          ],
        },
        expected:
          "http://example.com/first/second/third/forth/fifth/sixth/seventh/",
      });
    });

    it("overrides", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          path: "/first",
          pathParts: ["other"],
        },
        expected: "http://example.com/first",
      });
    });
  });

  describe("query", () => {
    it("builds", () => {
      testUrlBuilder({
        props: {
          queryParameters: {
            item1: "value1",
          },
        },
        expected: "http://?item1=value1",
      });
    });

    it("build with origin", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          queryParameters: {
            item1: "value1",
          },
        },
        expected: "http://example.com?item1=value1",
      });
    });

    it("build different data types", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          queryParameters: {
            number: 1,
            bool: true,
            string: "example",
            array: ["itemOne", "itemTwo"],
            none: undefined,
            nothing: null,
          },
        },
        expected:
          "http://example.com?array=itemOne&array=itemTwo&bool=true&nothing&number=1&string=example",
      });
    });

    it("encoded", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          queryParameters: {
            item1: "value1",
            item2: "",
            item3: "value 3",
            item4: undefined,
          },
        },
        expected: "http://example.com?item1=value1&item2=&item3=value%203",
      });
    });

    it("encoding disabled", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          queryParameters: {
            item1: "value 1",
          },
        },
        options: {
          encodeQueryParameters: false,
        },
        expected: "http://example.com?item1=value 1",
      });
    });
  });

  describe("hash", () => {
    it("builds", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          hash: "hash-value",
        },
        expected: "http://example.com#hash-value",
      });
    });

    it("encoded", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          hash: "hash value",
        },
        expected: "http://example.com#hash%20value",
      });
    });

    it("encoding disabled", () => {
      testUrlBuilder({
        props: {
          origin: "http://example.com",
          hash: "hash value",
        },
        options: {
          encodeHash: false,
        },
        expected: "http://example.com#hash value",
      });
    });
  });

  describe("url", () => {
    it("builds", () => {
      testUrlBuilder({
        props: {
          protocol: "https",
          protocolSeparator: ":://",
          username: "john",
          password: "secret",
          authSeparator: "::",
          authHostSeparator: "@@",
          hostname: "example-dash.com",
          hostSeparator: "::",
          port: "3465",
          pathParts: ["first-dash", "second"],
          pathSeparator: "-",
          querySeparator: "??",
          queryParameters: {
            item1: "value-1",
            item2: "value2",
          },
          hashSeparator: "##",
          hash: "hash-value",
        },
        expected:
          "https:://john::secret@@example-dash.com::3465-first-dash-second??item1=value-1&item2=value2##hash-value",
      });
    });

    it("build string", () => {
      const props = {
        origin: "http://example.com",
      };
      expect(new UrlBuilder(props).toString()).toEqual("http://example.com");
    });

    it("build url", () => {
      const props = {
        origin: "http://example.com",
      };
      expect(new UrlBuilder(props).toUrl()).toEqual("http://example.com");
    });

    it("special characters", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com",
          pathParts: ["maps", "api hats", "geo"],
          queryParameters: {
            key: "123 key",
            address: "#8/196 Alma Road North Perth 6006 AUS",
          },
        },
        expected:
          "https://example.com/maps/api%20hats/geo?address=%238%2F196%20Alma%20Road%20North%20Perth%206006%20AUS&key=123%20key",
      });
    });

    it("path without slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com",
          pathParts: ["first", "second"],
        },
        expected: "https://example.com/first/second",
      });
    });

    it("origin with trailing slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com/",
          pathParts: ["first", "second"],
        },
        expected: "https://example.com/first/second",
      });
    });

    it("path with leading slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com",
          pathParts: ["/first", "second"],
        },
        expected: "https://example.com/first/second",
      });
    });

    it("both origin and path with slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com/",
          pathParts: ["/first", "second"],
        },
        expected: "https://example.com/first/second",
      });
    });

    it("path item with trailing slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com",
          pathParts: ["first", "second/"],
        },
        expected: "https://example.com/first/second/",
      });
    });

    it("single path item with leading slash", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com/",
          pathParts: ["/first"],
        },
        expected: "https://example.com/first",
      });
    });

    it("single path item with both slashes", () => {
      testUrlBuilder({
        props: {
          origin: "https://example.com/",
          pathParts: ["/first/"],
        },
        expected: "https://example.com/first/",
      });
    });

    it("with url encoding required", () => {
      testUrlBuilder({
        props: {
          origin: "https://example space.com",
          pathParts: ["path with", "space"],
        },
        expected: "https://example%20space.com/path%20with/space",
      });
    });
  });
});
