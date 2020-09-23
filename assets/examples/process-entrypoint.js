/// [howto-entrypoint]
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, (logger) => {
  logger.info("Process entrypoint running.");
});
/// [howto-entrypoint]
