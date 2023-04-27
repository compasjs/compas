import { environment, isProduction, isStaging, mainFn } from "@compas/stdlib";
import { app, injectServices } from "../src/services.js";

mainFn(import.meta, main);

async function main(logger) {
  await injectServices();

  const port = Number(environment.PORT ?? "3001");
  app.listen(port, () => {
    logger.info({
      message: "Listening...",
      port,
      isProduction: isProduction(),
      isStaging: isStaging(),
    });
  });
}
