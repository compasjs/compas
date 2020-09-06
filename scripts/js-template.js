import { mainFn } from "@lbu/stdlib";
import {
  addCommonjsImport,
  addDestructuredImport,
  addStarImport,
  js,
  setupImports,
} from "../packages/code-gen/src/templates/index.js";

mainFn(import.meta, main);

export function main(logger) {
  logger.info(js`
  ${addStarImport("foo", "ba")}
  ${setupImports()}
  ${addCommonjsImport("fs", "fs")}
  ${addDestructuredImport("foo", "bar")}
  ${addDestructuredImport("baz", "bar")}
  `);
}
