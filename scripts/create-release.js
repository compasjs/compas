import { readFile } from "fs/promises";
import { mainFn } from "@lbu/stdlib";
import axios from "axios";

mainFn(import.meta, main);

async function main() {
  const [rawRef, githubToken] = process.argv.slice(2);

  const tag = rawRef.replace(/^refs\/tags\//, "");
  const fullChangelog = await readFile("./docs/changelog.md", "utf8");
  const changelogPart = parseChangelog(fullChangelog);

  await axios.request({
    url: "https://api.github.com/repos/lightbasenl/lbu/releases",
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
 * Quick hacky way to get the changelog of this release
 *
 * @param {string} fullChangelog
 * @returns {string}
 */
function parseChangelog(fullChangelog) {
  const firstIndex = fullChangelog.indexOf("###");
  const secondIndex = fullChangelog.indexOf("###", firstIndex + 1);

  const part = fullChangelog.substring(firstIndex, secondIndex);

  // Drop header line and trim result before returning
  return part.split("\n").slice(1).join("\n").trim();
}
