import { executeLogParser, newLogger, newLogParserContext } from "@lbu/insight";
import { isServerLog } from "@lbu/server/src/middleware";
import { mainFn } from "@lbu/stdlib";

mainFn(
  import.meta,
  newLogger({
    ctx: {
      type: "log_processing",
    },
  }),
  main,
);

/**
 * @param logger
 */
async function main(logger) {
  const store = {
    requests: 0,
  };
  let storeChanges = false;

  setInterval(() => {
    if (storeChanges) {
      logger.info(store);
    }
    storeChanges = false;
  }, 10000);

  const pc = newLogParserContext(process.stdin);

  pc.jsonProcessor = (obj) => {
    if (isServerLog(obj)) {
      store.requests++;
      storeChanges = true;
    }
  };

  executeLogParser(pc).pipe(process.stdout);
}
