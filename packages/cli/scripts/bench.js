import {
  filenameForModule,
  logBenchResults,
  mainFn,
  processDirectoryRecursive,
} from "@lbu/stdlib";

const __filename = filenameForModule(import.meta);

const contentHandler = async (logger, file) => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".bench.js")) {
    return;
  }
  const imported = await import(file);
  if (imported && imported.runBench) {
    await imported.runBench(logger);
  }
};

mainFn(import.meta, main);

async function main(logger) {
  await processDirectoryRecursive(process.cwd(), (file) =>
    contentHandler(logger, file),
  );
  logBenchResults(logger);
}
