import { readFile, writeFile } from "fs/promises";
import {
  isNil,
  mainFn,
  pathJoin,
  processDirectoryRecursive,
} from "@compas/stdlib";

mainFn(import.meta, main);

async function main(logger) {
  const blocks = await collectCodeBlocks(logger);
  const docFiles = await readDocFiles(logger);

  for (const file of docFiles) {
    replaceContentBlocks(logger, file, blocks);

    await writeFile(file.file, file.contents, "utf8");
  }
}

/**
 * Fetch all snippets from the asset directory
 *
 * In the form of:
 * ```js
 * /// [name]
 * const foo = "example content";
 * /// [name]
 * ```
 *
 * @returns {Promise<{ file: string, name: string, contents: string }[]>}
 */
async function collectCodeBlocks() {
  const result = [];

  await processDirectoryRecursive(
    pathJoin(process.cwd(), "assets/examples"),
    async (file) => {
      if (!file.endsWith(".js")) {
        return;
      }

      const contents = await readFile(file, "utf8");
      const parts = contents.split(/\/\/\//g);

      for (let i = 1; i < parts.length; i += 2) {
        const match = parts[i].match(/^\s*\[([\w-]+)]/);
        if (!isNil(match)) {
          const name = match[1];
          const contents = dedentString(
            parts[i].split("\n").slice(1).join("\n"),
          );
          result.push({
            file,
            name,
            contents,
          });
        }
      }
    },
  );

  return result;
}

/**
 * Read all markdown files in the docs directory
 * @returns {Promise<{ file: string, contents: string }[]>}
 */
async function readDocFiles() {
  const result = [];

  await processDirectoryRecursive(
    pathJoin(process.cwd(), "/docs"),
    async (file) => {
      if (!file.endsWith(".md")) {
        return;
      }

      const contents = await readFile(file, "utf8");

      result.push({
        file,
        contents,
      });
    },
  );

  return result;
}

/**
 * Brute force replace all blocks in `file.contents` with the provided blocks
 * @param {Logger} logger
 * @param file
 * @param blocks
 */
function replaceContentBlocks(logger, file, blocks) {
  for (const block of blocks) {
    const regex = `<!-- ${block.name} -->.+<!-- ${block.name} -->`;

    file.contents = file.contents.replace(
      RegExp(regex, "gms"),
      `<!-- ${block.name} -->

\`\`\`js
${block.contents}
\`\`\`

<!-- ${block.name} -->`,
    );
  }
}

/**
 * Tries to strip common indentation from all lines
 *
 * @param {string} str
 * @returns {string}
 */
function dedentString(str) {
  const parts = str.split("\n");
  const spaceRegex = /^([ \t]*)/g;

  let COMMON_INDENT = 200;
  for (const part of parts) {
    const match = part.match(spaceRegex);

    if (isNil(match)) {
      COMMON_INDENT = 0;
    } else {
      COMMON_INDENT = Math.min(COMMON_INDENT, match[0].length);
    }
  }

  return parts.map((it) => it.substring(COMMON_INDENT)).join("\n");
}
