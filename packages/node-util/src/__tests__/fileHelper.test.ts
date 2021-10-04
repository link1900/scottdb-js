import * as path from "path";
import * as fs from "fs";
import {
  createDirectory,
  createDirectoryOnDisk,
  deleteFileFromDisk,
  deleteFolderFromDisk,
  deletePath,
  doesPathExist,
  getFileInfo,
  getFileInfoFromDisk,
  readFileFromDisk,
  readJsonFileFromDisk,
  writeFileToDisk,
  writePath,
  readDirectoryFromDisk,
} from "../fileHelper";

describe("fileHelper", () => {
  describe("#readFileFromDisk", () => {
    const readFilePath = path.join(__dirname, "readTestFile.txt");
    it("reads the file correctly", async () => {
      const contents = await readFileFromDisk(readFilePath);
      expect(contents).toContain("read test file contents");
    });

    it("throws an exception when file cannot be read", async () => {
      try {
        await readFileFromDisk("no");
        expect(true).toEqual(false);
      } catch (e) {
        expect(e.message).toContain("ENOENT");
      }
    });
  });

  describe("#writeFileToDisk", () => {
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");

    afterAll(() => {
      fs.unlinkSync(writeFilePath);
    });

    it("write the file correctly", async () => {
      const result = await writeFileToDisk(writeFilePath, "write test file contents");
      expect(result).toBeTruthy();
      const contents = await readFileFromDisk(writeFilePath);
      expect(contents).toEqual("write test file contents");
    });

    it("throws an exception when file cannot be written", async () => {
      try {
        // @ts-ignore
        await writeFileToDisk(5, 5);
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("#createDirectoryOnDisk", () => {
    const writeFolderPath = path.join(__dirname, "testFolder");
    const writeFolderPathAlt = path.join(__dirname, "testFolderAlt");

    afterAll(() => {
      fs.rmdirSync(writeFolderPath);
      fs.rmdirSync(writeFolderPathAlt);
    });

    it("create the folder correctly", async () => {
      const result = await createDirectoryOnDisk(writeFolderPath);
      expect(result).toBeTruthy();
      const stats = fs.statSync(writeFolderPath);
      expect(stats.isDirectory()).toEqual(true);
    });

    it("throws an exception when directly cannot be written", async () => {
      const result = await createDirectoryOnDisk(writeFolderPathAlt);
      expect(result).toBeTruthy();
      try {
        await createDirectoryOnDisk(writeFolderPathAlt);
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("#readJsonFileFromDisk", () => {
    const readJsonFilePath = path.join(__dirname, "readJsonTestFile.json");
    it("reads the json file correctly", async () => {
      const contents = await readJsonFileFromDisk(readJsonFilePath);
      expect(contents).toEqual({ test: "file" });
    });
  });

  describe("#deleteFileFromDisk", () => {
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");

    it("delete the file correctly", async () => {
      const writeResult = await writeFileToDisk(writeFilePath, "write test file contents");
      expect(writeResult).toBeTruthy();
      const deleteResult = await deleteFileFromDisk(writeFilePath);
      expect(deleteResult).toEqual(true);
    });

    it("throws an exception when file cannot be deleted", async () => {
      try {
        await deleteFileFromDisk(writeFilePath);
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("#getFileInfoFromDisk", () => {
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");
    const fileDoesNotExist = path.join(__dirname, "nonFile.txt");

    afterAll(() => {
      fs.unlinkSync(writeFilePath);
    });

    it("gets file info correctly", async () => {
      const writeResult = await writeFileToDisk(writeFilePath, "write test file contents");
      expect(writeResult).toBeTruthy();
      const stats = await getFileInfoFromDisk(writeFilePath);
      expect(stats).toBeTruthy();
      expect(stats.isFile()).toBeTruthy();
    });

    it("throws an exception when file cannot be found", async () => {
      try {
        await getFileInfoFromDisk(fileDoesNotExist);
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("#getFileInfo", () => {
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");
    const fileDoesNotExist = path.join(__dirname, "nonFile.txt");

    afterAll(() => {
      fs.unlinkSync(writeFilePath);
    });

    it("gets file info correctly", async () => {
      const writeResult = await writeFileToDisk(writeFilePath, "write test file contents");
      expect(writeResult).toBeTruthy();
      const stats = await getFileInfo(writeFilePath);
      if (!stats) {
        throw new Error("not found");
      }
      expect(stats).toBeTruthy();
      expect(stats.isFile()).toBeTruthy();
    });

    it("return undefined when file is not found", async () => {
      const stats = await getFileInfo(fileDoesNotExist);
      expect(stats).toBeFalsy();
    });
  });

  describe("#doesPathExist", () => {
    const fileDoesNotExist = path.join(__dirname, "nonFile.txt");
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");

    afterAll(() => {
      fs.unlinkSync(writeFilePath);
    });

    it("returns false when file does not exist", async () => {
      const result = await doesPathExist(fileDoesNotExist);
      expect(result).toBeFalsy();
    });

    it("true when file exists", async () => {
      await writeFileToDisk(writeFilePath, "write test file contents");
      const result = await doesPathExist(writeFilePath);
      expect(result).toBeTruthy();
    });
  });

  describe("#deleteFolderFromDisk", () => {
    const writeFolderPath = path.join(__dirname, "testFolder");

    it("delete the folder correctly", async () => {
      const writeResult = await createDirectoryOnDisk(writeFolderPath);
      expect(writeResult).toBeTruthy();
      const deleteResult = await deleteFolderFromDisk(writeFolderPath);
      expect(deleteResult).toEqual(true);
    });

    it("throws an exception when file cannot be deleted", async () => {
      try {
        await deleteFolderFromDisk(writeFolderPath);
        expect(true).toEqual(false);
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("#deletePath", () => {
    const writeFolderPath = path.join(__dirname, "testFolder");
    const fileDoesNotExist = path.join(__dirname, "nonFile.txt");
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");

    it("delete the folder correctly", async () => {
      const writeResult = await createDirectoryOnDisk(writeFolderPath);
      expect(writeResult).toBeTruthy();
      const deleteResult = await deletePath(writeFolderPath);
      expect(deleteResult).toEqual(true);
    });

    it("delete the file correctly", async () => {
      const writeResult = await writeFileToDisk(writeFilePath, "write test file contents");
      expect(writeResult).toBeTruthy();
      const deleteResult = await deletePath(writeFilePath);
      expect(deleteResult).toEqual(true);
    });

    it("return true when file does not exist", async () => {
      const deleteResult = await deletePath(fileDoesNotExist);
      expect(deleteResult).toEqual(true);
    });

    it("return false when file cannot be deleted", async () => {
      const deleteResult = await deletePath(fileDoesNotExist);
      expect(deleteResult).toEqual(true);
    });
  });

  describe("#createDirectory", () => {
    const writeFolderPath0 = path.join(__dirname, "testFolder");
    const writeFolderPath1 = path.join(__dirname, "some");
    const writeFolderPath2 = path.join(writeFolderPath1, "more");
    const writeFolderPath3 = path.join(writeFolderPath2, "folders");

    afterAll(() => {
      fs.rmdirSync(writeFolderPath0);
      fs.rmdirSync(writeFolderPath3);
      fs.rmdirSync(writeFolderPath2);
      fs.rmdirSync(writeFolderPath1);
    });

    it("create the folder correctly", async () => {
      const result = await createDirectory(writeFolderPath0);
      expect(result).toBeTruthy();
      const stats = fs.statSync(writeFolderPath0);
      expect(stats.isDirectory()).toEqual(true);
    });

    it("create the folder in depth correctly", async () => {
      const result = await createDirectory(writeFolderPath3);
      expect(result).toBeTruthy();
      const stats = fs.statSync(writeFolderPath3);
      expect(stats.isDirectory()).toEqual(true);
    });

    it("does not error when folder exists already", async () => {
      const firstResult = await createDirectory(writeFolderPath0);
      expect(firstResult).toBeTruthy();
      const stats = fs.statSync(writeFolderPath0);
      expect(stats.isDirectory()).toEqual(true);
      const secondResult = await createDirectory(writeFolderPath0);
      expect(secondResult).toBeTruthy();
    });
  });

  describe("#writePath", () => {
    const writeFilePath = path.join(__dirname, "writeTestFile.txt");
    const writeFolderDeepPath = path.join(__dirname, "deep");
    const writeFolderDeeperPath = path.join(writeFolderDeepPath, "path");
    const writeFileDeepPath = path.join(writeFolderDeeperPath, "writeTestFile.txt");

    afterAll(() => {
      fs.unlinkSync(writeFilePath);
      fs.unlinkSync(writeFileDeepPath);
      fs.rmdirSync(writeFolderDeeperPath);
      fs.rmdirSync(writeFolderDeepPath);
    });

    it("write the file correctly", async () => {
      const result = await writePath(writeFilePath, "write test file contents");
      expect(result).toBeTruthy();
      const contents = await readFileFromDisk(writeFilePath);
      expect(contents).toEqual("write test file contents");
    });

    it("write the deep file correctly", async () => {
      const result = await writePath(writeFileDeepPath, "write test file contents");
      expect(result).toBeTruthy();
      const contents = await readFileFromDisk(writeFileDeepPath);
      expect(contents).toEqual("write test file contents");
    });
  });

  describe("#readDirectoryFromDisk", () => {
    const readFolderPath = path.join(__dirname);
    it("reads the folder correctly", async () => {
      const contents = await readDirectoryFromDisk(readFolderPath);
      expect(contents.length).toBeGreaterThan(0);
    });

    it("throws an exception when folder cannot be read", async () => {
      try {
        await readDirectoryFromDisk("no");
        expect(true).toEqual(false);
      } catch (e) {
        expect(e.message).toContain("ENOENT");
      }
    });
  });
});
