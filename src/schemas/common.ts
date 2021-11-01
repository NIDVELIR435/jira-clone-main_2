import { z } from "zod";

import { Id } from "common";

export const id = (): z.Schema<Id> => z.number();
