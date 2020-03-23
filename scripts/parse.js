import { addProcessor, newLogger, parseExec } from "@lbu/insight";
import { logParser } from "@lbu/server";
import { mainFn } from "@lbu/stdlib";

const main = async (logger) => {
  const store = {
    httpSummary: {},
    warnings: [],
    count: 0,
  };
  let storeChanges = false;

  setInterval(() => {
    if (storeChanges) {
      logger.info(store);
    }
    storeChanges = false;
  }, 10000);

  addProcessor("JSON", logParser(store.httpSummary));
  addProcessor("TEXT", (line) => store.warnings.push(line));
  addProcessor("JSON", () => {
    store.count++;
    storeChanges = true;
  });

  const out = parseExec();

  out.pipe(process.stdout);
};

mainFn(
  import.meta,
  newLogger({
    ctx: {
      type: "LOG_PROCESSING",
    },
  }),
  main,
);
