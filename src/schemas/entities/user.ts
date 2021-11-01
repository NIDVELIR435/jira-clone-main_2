import { z } from "zod";

import { id } from "schemas/common";

export const userSchema = (): z.SomeZodObject =>
  z.object({
    id: id(),
    name: z.string(),
  });
