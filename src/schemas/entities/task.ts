import { z } from "zod";

import { Status } from "common";

import { id } from "schemas/common";

export const taskSchema = (): z.SomeZodObject =>
  z.object({
    id: id(),
    userId: id(),
    title: z.string(),
    status: z.nativeEnum(Status).default(Status.TODO),
  });
