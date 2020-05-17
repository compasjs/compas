import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";
import { constructApp } from "../src/api.js";

mainFn(import.meta, log, main);

async function main(logger) {
  const app = constructApp();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info({ msg: "Listening", port });
  });
}
