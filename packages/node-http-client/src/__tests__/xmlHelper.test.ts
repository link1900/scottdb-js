import { parseJsonToXml, parseXmlToJson } from "../xmlHelper";

describe("xmlHelper", () => {
  describe("parseJsonToXml()", () => {
    it("return valid xml for a json object", async () => {
      const result = parseJsonToXml({
        body: {
          "@_name": "John",
          arm: {
            hand: "left",
          },
          foot: "",
        },
      });
      expect(result).toEqual(
        '<body name="John"><arm><hand>left</hand></arm><foot></foot></body>'
      );
    });

    it("return valid xml for a json object and options", async () => {
      const result = parseJsonToXml(
        {
          body: {
            "@_name": "John",
            arm: {
              hand: "left",
            },
            foot: "",
          },
        },
        { supressEmptyNode: true }
      );
      expect(result).toEqual(
        '<body name="John"><arm><hand>left</hand></arm><foot/></body>'
      );
    });
  });

  describe("parseXmlToJson()", () => {
    it("returns valid json for a xml string", async () => {
      const result = parseXmlToJson(`<?xml version="1.0"?>
            <body name="John">
              <arm>
                <hand>+2</hand>
              </arm>
              <foot/>
            </body>
        `);
      expect(result).toEqual({
        body: {
          "@_name": "John",
          arm: {
            hand: "+2",
          },
          foot: "",
        },
      });
    });

    it("returns valid json for a xml string and options", async () => {
      const result = parseXmlToJson(
        `<?xml version="1.0"?>
            <body name="John">
              <arm>
                <hand>2</hand>
              </arm>
              <foot/>
            </body>
        `,
        { parseTrueNumberOnly: false }
      );
      expect(result).toEqual({
        body: {
          "@_name": "John",
          arm: {
            hand: "2",
          },
          foot: "",
        },
      });
    });
  });
});
