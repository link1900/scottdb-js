import {
  connectToPostgresDatabase,
  disconnectFromDatabase,
  getPostgresDatabaseLambdaOptions
} from "../databaseService";
import { Example } from "./Example";

describe("databaseService", () => {
  beforeAll(() => {
    process.env["DATABASE_NAME"] = "lib-test";
    process.env["DATABASE_USERNAME"] = "lib_test";
    process.env["DATABASE_PASSWORD"] = "lib_test";
    process.env["DATABASE_HOST"] = "127.0.0.1";

    process.env["DATABASE_DROP_ON_START"] = "true";
    process.env["DATABASE_SYNC"] = "true";
    process.env["DATABASE_LOGGING"] = "false";
  });

  describe("connectToPostgresDatabase()", () => {
    it("connects to a test database correctly", async () => {
      const datasource = await connectToPostgresDatabase(
        getPostgresDatabaseLambdaOptions([Example], [])
      );
      expect(datasource).toBeTruthy();
      const exampleRepo = datasource.getRepository(Example);
      const example = new Example();
      example.name = "example1";
      const result = await exampleRepo.save(example);
      expect(result.name).toEqual("example1");
      const found = await exampleRepo.findOne({ where: { name: "example1" } });
      expect(found?.name).toEqual("example1");
      await disconnectFromDatabase(datasource);
    });
  });
});
