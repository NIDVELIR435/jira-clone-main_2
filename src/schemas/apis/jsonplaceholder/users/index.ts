import { z } from "zod";

import { userSchema } from "schemas/entities/user";

export const getAllUsersSchema = (): z.ZodArray<
  ReturnType<typeof userSchema>
> => z.array(userSchema());
