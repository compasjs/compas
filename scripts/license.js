import { readFile } from "node:fs/promises";
import {
  AppError,
  isNil,
  mainFn,
  processDirectoryRecursiveSync,
} from "@compas/stdlib";

mainFn(import.meta, main);

async function main(logger) {
  const files = [];

  processDirectoryRecursiveSync(
    process.cwd(),
    (file) => {
      // the 'resolve' package includes its tests files.
      if (file.includes("/test/")) {
        return;
      }
      if (file.endsWith("package.json")) {
        files.push(file);
      }
    },
    {
      skipNodeModules: false,
    },
  );

  const bagOfFiles = [];
  while (files.length) {
    bagOfFiles.push(files.splice(0, 10));
  }

  let failureCount = 0;
  const result = {
    summary: {},
    byLicense: {},
  };

  for (const bag of bagOfFiles) {
    await Promise.all(
      bag.map(async (file) => {
        const contents = await readFile(file, "utf-8");

        try {
          let { name, license, licenses } = JSON.parse(contents);

          if (isNil(name)) {
            return;
          }

          if (isNil(license) && Array.isArray(licenses)) {
            license = licenses[0];
            // Satisfy eslint
            licenses = [];
          }

          if (
            typeof license !== "string" &&
            typeof license?.type === "string"
          ) {
            license = license.type;
          }

          if (isNil(license)) {
            name = { name, file };
            license = "Not specified";
          }

          if (isNil(result.summary[license])) {
            result.summary[license] = 1;
          } else {
            result.summary[license] += 1;
          }

          if (isNil(result.byLicense[license])) {
            result.byLicense[license] = [name];
          } else {
            result.byLicense[license].push(name);
          }
        } catch (e) {
          logger.error(AppError.format(e));
          failureCount++;
        }
      }),
    );
  }

  logger.info({
    failureCount,
    result,
  });
}
