import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type ValidateTarget = "body" | "query" | "params";

// Usage: router.post("/", validate(createEventSchema), controller)
export function validate(schema: ZodType, target: ValidateTarget = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    req[target] = schema.parse(req[target]);
    next();
  };
}
