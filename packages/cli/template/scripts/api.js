import { log } from "@lbu/insight";
import { mainFn, isProduction, isStaging } from "@lbu/stdlib";
import { constructApp } from "../src/api.js";
import { injectServices } from "../src/service.js";
import { app } from "../src/services/index.js";

mainFn(import.meta, log, main);

/**
 * @param {Logger} logger
 */
async function main(logger) {
  await injectServices();
  await constructApp();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info({
      msg: "Listening",
      port,
      isProduction: isProduction(),
      isStaging: isStaging(),
    });
  });
}
