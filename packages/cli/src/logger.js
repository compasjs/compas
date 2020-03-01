import { newLogger } from "@lbu/insight";

export const logger = newLogger({
  ctx: {
    type: "CLI",
  },
});
