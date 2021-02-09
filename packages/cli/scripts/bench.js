import { pathToFileURL } from "url";
import {
  filenameForModule,
  mainFn,
  processDirectoryRecursive,
} from "@compas/stdlib";
import { mainBenchFn } from "../index.js";

const __filename = filenameForModule(import.meta);

const contentHandler = async (file) => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".bench.js")) {
    return;
  }
  await import(pathToFileURL(file));
};

mainFn(import.meta, main);

async function main() {
  await processDirectoryRecursive(process.cwd(), contentHandler);
  mainBenchFn(import.meta);
}
