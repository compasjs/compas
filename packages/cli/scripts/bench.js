import {
  filenameForModule,
  mainFn,
  processDirectoryRecursive,
} from "@lbu/stdlib";
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
  await import(file);
};

mainFn(import.meta, main);

async function main() {
  await processDirectoryRecursive(process.cwd(), contentHandler);
  mainBenchFn(import.meta);
}
