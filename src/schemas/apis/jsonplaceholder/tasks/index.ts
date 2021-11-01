import { z } from "zod";

import { taskSchema } from "schemas/entities";

export const getAllTasksSchema = (): z.ZodArray<
  ReturnType<typeof taskSchema>
> => z.array(taskSchema());
