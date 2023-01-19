import { readFileSync } from "fs";
import { dirnameForModule, pathJoin } from "@compas/stdlib";

/**
 * Get the code-gen structure provided by @compas/store
 *
 * @returns {any}
 */
export function storeGetStructure() {
  return JSON.parse(
    readFileSync(
      pathJoin(
        dirnameForModule(import.meta),
        "generated/common/structure.json",
      ),
      "utf-8",
    ),
  );
}
