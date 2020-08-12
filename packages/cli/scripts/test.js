import {
  filenameForModule,
  mainFn,
  processDirectoryRecursiveSync,
} from "@lbu/stdlib";

const __filename = filenameForModule(import.meta);

const contentHandler = async (file) => {
  // Skip this index file
  if (file === __filename) {
    return;
  }
  if (!file.endsWith(".test.js")) {
    return;
  }
  await import(file);
};

mainFn(import.meta, main);

async function main() {
  await processDirectoryRecursiveSync(process.cwd(), contentHandler);
}
