import { z } from "zod";

export function defaultObject<T extends z.ZodRawShape>(shape: T) {
  return z.preprocess((input) => input ?? {}, z.object(shape).strip());
}
