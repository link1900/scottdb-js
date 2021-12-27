import { Request, Response } from "express";

export interface ExpressRequestContext {
  express?: {
    req: Request;
    res: Response;
  };
}
