/// [howto-entrypoint]
import { mainFn } from "@compas/stdlib";

mainFn(import.meta, (logger) => {
  logger.info("Process entrypoint running.");
});
/// [howto-entrypoint]
