import { environment, mainFn } from "@compas/stdlib";
import { setStoreQueries } from "@compas/store";
import { buildServer } from "../src/app.js";
import { queries } from "../src/generated/database/index.js";

mainFn(import.meta, main);

async function main() {
  setStoreQueries(queries);
  const app = await buildServer();

  const port = parseInt(environment.PORT ?? "3000");
  app.listen(port);
}
