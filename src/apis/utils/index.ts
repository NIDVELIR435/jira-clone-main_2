import type { ZodTypeAny } from "zod";
import type { AxiosResponse } from "axios";

export const validateFormatAxiosResponse =
  <T>(schema: ZodTypeAny) =>
  (res: AxiosResponse<T>): Promise<T> =>
    schema.parseAsync(res.data);
