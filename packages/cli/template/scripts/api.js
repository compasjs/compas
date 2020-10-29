import { mainFn, isProduction, isStaging, environment } from "@lbu/stdlib";
import { constructApp } from "../src/api.js";
import { injectServices } from "../src/service.js";
import { app } from "../src/services/index.js";

mainFn(import.meta, main);

/**
 * @param {Logger} logger
 */
async function main(logger) {
  await injectServices();
  await constructApp();

  const port = environment.PORT || 3000;
  app.listen(port, () => {
    logger.info({
      msg: "Listening",
      port,
      isProduction: isProduction(),
      isStaging: isStaging(),
    });
  });
}
