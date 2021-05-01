import { pathToFileURL } from "url";
import {
  AppError,
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

  try {
    await import(pathToFileURL(file));
  } catch (e) {
    throw AppError.serverError(
      {
        file,
      },
      e,
    );
  }
};

mainFn(import.meta, main);

async function main() {
  await processDirectoryRecursive(process.cwd(), contentHandler);
  mainBenchFn(import.meta);
}
