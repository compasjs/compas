import { readFile, writeFile } from "fs/promises";
import { packages, symbols } from "./packages.js";

const marker = "<!-- marker -->";
const apiIndexPath = "./docs/api/index.md";

/**
 * Build a TOC for the api docs
 *
 * @returns {Promise<void>}
 */
export async function syncJSDocBasedToc() {
  const contents = await readFile(apiIndexPath, "utf-8");
  const [start, , end] = contents.split(marker);
  const toc = buildToc();

  await writeFile(
    apiIndexPath,
    `${start}
${marker}
${toc}
${marker}
${end}`,
  );
}

/**
 * @returns {string}
 */
function buildToc() {
  let result = "";

  for (const pkg of packages) {
    result += `## @compas/${pkg}\n`;

    for (const symbol of symbols[pkg]) {
      result += `- [${symbol}](./${pkg}.html#${symbol.toLowerCase()})\n`;
    }
    result += "\n\n";
  }

  return result;
}
