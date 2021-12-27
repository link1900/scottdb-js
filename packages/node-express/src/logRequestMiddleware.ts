import { logger } from "@link1900/node-logger";
import { uuid } from "@link1900/node-util";
import { Request, Response, NextFunction } from "express";

let ignoredLogPaths: string[] = [];

export function getIgnoredLogPaths() {
  return ignoredLogPaths;
}

export function addIgnoredLogPath(logPath: string) {
  ignoredLogPaths.push(logPath);
}

export function removeIgnoredLogPath(logPath: string) {
  ignoredLogPaths = ignoredLogPaths.filter((l) => l !== logPath);
}

export function resetIgnoredLogPaths() {
  ignoredLogPaths = [];
}

export const logRequestMiddleware: () => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const requestId = uuid();
    (req as any).requestId = requestId;
    const ignoredPaths = getIgnoredLogPaths();
    if (!ignoredPaths.includes(req.path)) {
      const requestMeta = {
        httpMethod: req.method,
        path: req.path,
        requestId,
      };
      logger.info(
        `[${requestMeta.httpMethod}][${requestMeta.path}]`,
        requestMeta
      );
    }
    next();
  };
