import fs, { WriteFileOptions } from 'fs';
import path from 'path';
import { stringToObject } from './objectHelper';

export async function readFileFromDisk(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

export async function writeFileToDisk(
  filePath: string,
  data: string,
  options: WriteFileOptions = {}
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.writeFile(filePath, data, options, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function createDirectoryOnDisk(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.mkdir(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function readJsonFileFromDisk(filePath: string): Promise<object> {
  const stringValue = await readFileFromDisk(filePath);
  return stringToObject(stringValue);
}

export async function deleteFileFromDisk(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function getFileInfoFromDisk(filePath: string): Promise<fs.Stats> {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(filePath, (err, stats: fs.Stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

export async function getFileInfo(filePath: string): Promise<fs.Stats | undefined> {
  try {
    return await getFileInfoFromDisk(filePath);
  } catch (error) {
    return undefined;
  }
}

export async function doesPathExist(filePath: string): Promise<boolean> {
  const stats = await getFileInfo(filePath);
  if (!stats) {
    return false;
  }
  return stats.isFile() || stats.isDirectory();
}

export async function deleteFolderFromDisk(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fs.rmdir(filePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

export async function deletePath(filePath: string): Promise<boolean> {
  const stats = await getFileInfo(filePath);
  if (!stats) {
    return true;
  }
  if (stats.isDirectory()) {
    return deleteFolderFromDisk(filePath);
  }
  if (stats.isFile()) {
    return deleteFileFromDisk(filePath);
  }

  return false;
}

export async function createDirectory(filePath: string): Promise<boolean> {
  const doesDirExist = await doesPathExist(filePath);
  if (doesDirExist) {
    return true;
  }
  const parentDir = path.dirname(filePath);
  const doesParentDirExist = await doesPathExist(parentDir);
  if (!doesParentDirExist) {
    await createDirectory(parentDir);
  }

  return createDirectoryOnDisk(filePath);
}

export async function writePath(filePath: string, data: string, options: WriteFileOptions = {}): Promise<boolean> {
  const dir = path.dirname(filePath);
  await createDirectory(dir);
  return writeFileToDisk(filePath, data, options);
}

export async function readDirectoryFromDisk(filePath: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}
