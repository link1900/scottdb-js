import path from "path";
import {
  getVariable,
  getVariableAsInteger,
  isVariableEnabled,
  loadConfigFile,
  loadConfigForEnvironment,
  loadConfigObject,
  setVariable,
} from "../environmentHelper";
import { ErrorCode } from "@link1900/node-error";
import { writePath, deletePath } from "@link1900/node-util";

describe("environmentHelper", () => {
  describe("#getVariable", () => {
    it("returns env var correctly", () => {
      process.env.TEMP_TEST_VAR = "123";
      const result = getVariable("TEMP_TEST_VAR");
      expect(result).toEqual("123");
    });

    it("returns default value when supplied", () => {
      const result = getVariable("TEMP_TEST_VAR1", "defaultValue");
      expect(result).toEqual("defaultValue");
    });

    it("returns with error when var is not found", () => {
      try {
        getVariable("TEMP_TEST_VAR1");
        expect(false).toEqual(true);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe("#getVariableAsInteger", () => {
    it("returns env var correctly as number", () => {
      process.env.TEMP_TEST_VAR_NUM = "666";
      const result = getVariableAsInteger("TEMP_TEST_VAR_NUM");
      expect(result).toEqual(666);
    });

    it("returns default value when supplied", () => {
      process.env.TEMP_TEST_VAR_NUM_BAD = "not a number";

      try {
        getVariableAsInteger("TEMP_TEST_VAR_NUM_BAD");
        expect(false).toEqual(true);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });

    it("returns with error when var is not found", () => {
      try {
        getVariableAsInteger("TEMP_TEST_VAR1");
        expect(false).toEqual(true);
      } catch (error) {
        expect(error.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe("#isVariableEnabled", () => {
    it("is true when set to true string", () => {
      process.env.TEMP_TEST_VAR_BOOLEAN = "true";
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN");
      expect(result).toEqual(true);
    });

    it("is true when set to  True string", () => {
      process.env.TEMP_TEST_VAR_BOOLEAN = " True";
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN");
      expect(result).toEqual(true);
    });

    it("is false when not set", () => {
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN_OTHER");
      expect(result).toEqual(false);
    });

    it("is false when set to false string", () => {
      process.env.TEMP_TEST_VAR_BOOLEAN = "false";
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN");
      expect(result).toEqual(false);
    });

    it("is false when set null", () => {
      process.env.TEMP_TEST_VAR_BOOLEAN = undefined;
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN");
      expect(result).toEqual(false);
    });

    it("is false when set to blank string", () => {
      process.env.TEMP_TEST_VAR_BOOLEAN = "";
      const result = isVariableEnabled("TEMP_TEST_VAR_BOOLEAN");
      expect(result).toEqual(false);
    });
  });

  describe("#setVariable", () => {
    it("sets the environment variable when one is not already set", () => {
      const result = setVariable("TEMP_TEST_SET_VAR", "123");
      expect(result).toEqual(true);
      expect(process.env.TEMP_TEST_SET_VAR).toEqual("123");
    });

    it("does not set the environment variable when one is already set", () => {
      process.env.TEMP_TEST_SET_VAR = "456";
      const result = setVariable("TEMP_TEST_SET_VAR", "789", true);
      expect(result).toEqual(false);
      expect(process.env.TEMP_TEST_SET_VAR).toEqual("456");
    });

    it("sets the environment variable when one is already set when disable override is false", () => {
      process.env.TEMP_TEST_SET_VAR = "456";
      const result = setVariable("TEMP_TEST_SET_VAR", "789", false);
      expect(result).toEqual(true);
      expect(process.env.TEMP_TEST_SET_VAR).toEqual("789");
    });
  });

  describe("#loadConfigFile", () => {
    const writeFilePath = path.join(__dirname, "env-local-test-example.json");
    const writeFilePathBroken = path.join(
      __dirname,
      "env-local-test-example-broken.json"
    );

    afterEach(async () => {
      await deletePath(writeFilePath);
      delete process.env.exampleVar;
    });

    it("loads a test config file into environment variables", async () => {
      const data = JSON.stringify({ exampleVar: "exampleVarValue" });
      await writePath(writeFilePath, data);
      const result = await loadConfigFile(writeFilePath);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("exampleVarValue");
      expect(getVariable("exampleVar")).toEqual("exampleVarValue");
    });

    it("fails to load test config file into environment variables", async () => {
      const result = await loadConfigFile(writeFilePathBroken);
      expect(result).toEqual(false);
    });

    it("does not override existing env vars when override is not defined", async () => {
      const data = JSON.stringify({ exampleVar: "newValue" });
      process.env.exampleVar = "existingValue";
      await writePath(writeFilePath, data);
      const result = await loadConfigFile(writeFilePath);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("existingValue");
      expect(getVariable("exampleVar")).toEqual("existingValue");
    });

    it("does not override existing env vars when override is false", async () => {
      const data = JSON.stringify({ exampleVar: "newValue" });
      process.env.exampleVar = "existingValue";
      await writePath(writeFilePath, data);
      const result = await loadConfigFile(writeFilePath, false);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("existingValue");
    });

    it("does override existing env vars when override is true", async () => {
      const data = JSON.stringify({ exampleVar: "newValue" });
      process.env.exampleVar = "existingValue";
      await writePath(writeFilePath, data);
      const result = await loadConfigFile(writeFilePath, true);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("newValue");
    });
  });

  describe("#loadConfigObject", () => {
    afterEach(async () => {
      delete process.env.exampleVar;
    });

    it("loads a test config into environment variables", async () => {
      const data = { exampleVar: "exampleVarValue" };
      const result = loadConfigObject(data);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("exampleVarValue");
      expect(getVariable("exampleVar")).toEqual("exampleVarValue");
    });

    it("does not override existing env vars when override is not defined", async () => {
      const data = { exampleVar: "newValue" };
      process.env.exampleVar = "existingValue";
      const result = loadConfigObject(data);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("existingValue");
      expect(getVariable("exampleVar")).toEqual("existingValue");
    });

    it("does not override existing env vars when override is false", async () => {
      const data = { exampleVar: "newValue" };
      process.env.exampleVar = "existingValue";
      const result = loadConfigObject(data, false);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("existingValue");
    });

    it("does override existing env vars when override is true", async () => {
      const data = { exampleVar: "newValue" };
      process.env.exampleVar = "existingValue";
      const result = loadConfigObject(data, true);
      expect(result).toEqual(true);
      expect(process.env.exampleVar).toEqual("newValue");
    });
  });

  describe("#loadConfigForEnvironment", () => {
    afterEach(async () => {
      delete process.env.exampleVar;
      delete process.env.extraVar;
      delete process.env.localSecretVar;
      delete process.env.remoteSecretVar;
      process.env.EXECUTION_ENVIRONMENT = "local-test";
    });

    const testConfigPath = path.join(__dirname, "..", "config");

    it("load base config correctly", async () => {
      delete process.env.EXECUTION_ENVIRONMENT;
      await loadConfigForEnvironment(testConfigPath);
      expect(process.env.exampleVar).toEqual("baseValue");
      expect(process.env.localSecretVar).toEqual("top-secret");
      expect(process.env.remoteSecretVar).toEqual("another-top-secret");
    });

    it("load base extra config correctly", async () => {
      process.env.EXECUTION_ENVIRONMENT = "local-test";
      await loadConfigForEnvironment(testConfigPath);
      expect(process.env.exampleVar).toEqual("test-value");
      expect(process.env.extraVar).toEqual("extra-value");
      expect(process.env.localSecretVar).toEqual("top-secret");
      expect(process.env.remoteSecretVar).toEqual("more-top-secret");
    });
  });
});
