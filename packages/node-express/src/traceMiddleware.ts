import { uuid } from "@link1900/node-util";
import { NextFunction, Request, Response } from "express";
import { getLocalItem, setLocalItem } from "@link1900/node-async-storage";
import { logger, LoggerInterface } from "@link1900/node-logger-api";

export interface TraceMiddlewareOptions {
  /** Custom trace id headers to pass into the log trace */
  traceHeaders?: string[];
  addTraceToLogs?: boolean;
  loggerToTrace?: LoggerInterface;
  logMetaDataField?: string;
  ignoredPaths?: string[];
  addRequestId?: boolean;
  logRequest?: boolean;
}
export const LOG_META_TRACE_KEY = "log-meta-trace";

/**
 * Configures a middleware that will get headers off the request
 * and stores them in local storage. Also configures the global logger
 * to log those headers in each log request.
 * @param options Options object for the logger middleware
 */
export function applyTraceMiddleware(
  options: TraceMiddlewareOptions = {}
): (req: Request, res: Response, next: NextFunction) => void {
  const {
    traceHeaders = [],
    addTraceToLogs = true,
    addRequestId = true,
    logRequest = true,
    loggerToTrace = logger,
    logMetaDataField,
    ignoredPaths = []
  } = options;
  if (addTraceToLogs) {
    loggerToTrace.addMetaHook(() => {
      const traceMetaData = getLocalItem(LOG_META_TRACE_KEY);
      if (!traceMetaData) {
        return undefined;
      }
      if (logMetaDataField) {
        return {
          [logMetaDataField]: traceMetaData
        };
      }
      return traceMetaData;
    });
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (ignoredPaths.includes(req.path) || !addTraceToLogs) {
      setLocalItem(LOG_META_TRACE_KEY, undefined);
    } else {
      const trace: any = {};

      traceHeaders.forEach(header => {
        trace[header] = req.headers[header];
      });

      if (addRequestId) {
        const requestId = uuid();
        // other middleware is expecting the requestId to be on the express res object
        res.locals.requestId = requestId;
        trace["requestId"] = requestId;
      }

      setLocalItem(LOG_META_TRACE_KEY, trace);

      if (logRequest) {
        const requestMeta = {
          httpMethod: req.method,
          path: req.path
        };
        logger.info(
          `[${requestMeta.httpMethod}][${requestMeta.path}] received request`
        );
      }
    }
    next();
  };
}
