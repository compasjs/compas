import { readFile } from "fs/promises";
import { mainFn } from "@compas/stdlib";
import axios from "axios";

mainFn(import.meta, main);

async function main() {
  const rawRef = process.env.GITHUB_REF;
  const [githubToken] = process.argv.slice(2);

  const tag = rawRef.replace(/^refs\/tags\//, "");
  const fullChangelog = await readFile("./changelog.md", "utf8");
  let changelogPart = parseChangelog(fullChangelog);
  changelogPart = replaceContributorNames(changelogPart);

  await axios.request({
    url: "https://api.github.com/repos/compasjs/compas/releases",
    method: "POST",
    auth: {
      username: "github-actions[bot]",
      password: githubToken,
    },
    data: {
      tag_name: tag,
      name: tag,
      body: changelogPart,
      draft: false,
      prerelease: false,
    },
  });
}

/**
 * Quick hacky way to get the changelog of this release.
 * Since our MD files are capped at x characters, we need to reconstruct these to long
 * strings, cause the GitHub release renderer treats newlines as end of paragraph.
 *
 * @param {string} fullChangelog
 * @returns {string}
 */
function parseChangelog(fullChangelog) {
  const firstIndex = fullChangelog.indexOf("### [");
  const secondIndex = fullChangelog.indexOf("### [", firstIndex + 1);

  const parts = fullChangelog
    .substring(firstIndex, secondIndex)
    .trim()
    .split("\n");

  const result = [];
  let hasEmptyLine = false;
  let isInCodeBlock = false;

  for (let i = 1; i < parts.length; ++i) {
    const thisPart = parts[i].trim();

    // Start a new line on an empty line or a new bullet point
    // Code blocks also should just use the original contents
    if (thisPart.startsWith("-") || hasEmptyLine || isInCodeBlock) {
      result.push(parts[i]);
      hasEmptyLine = false;
    } else if (thisPart.length === 0) {
      hasEmptyLine = true;
      result.push("");
    } else if (thisPart.startsWith("```")) {
      result.push(parts[i]);

      isInCodeBlock = !isInCodeBlock;
    } else {
      // Concatenate the different sentence parts together
      result[result.length - 1] += ` ${thisPart}`;
    }
  }

  return result.join("\n");
}

/**
 * Replace full contributor GitHub profile links with just the username as Github will
 * automatically link them correctly.
 *
 * @param {string} changelog
 * @returns {string}
 */
function replaceContributorNames(changelog) {
  return changelog.replace(/\[(@\w+)]\(.*\)/g, "$1");
}
