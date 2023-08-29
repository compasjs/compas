import { writeFile, mkdir } from "node:fs/promises";

/**
 * Write a file.
 *
 * Always executes a mkdir operation, to ensure that the directory exists.
 *
 * @param {string} file
 * @param {string|Buffer} contents
 * @returns {Promise<void>}
 */
export async function writeFileChecked(file, contents) {
  const dir = file.split("/").slice(0, -1).join("/");

  if (dir.length && file.includes("/")) {
    // file could be something like "package.json", which means that we write to the
    // current working directory. Which most likely exists already.
    await mkdir(dir, { recursive: true });
  }
  await writeFile(file, contents);
}
