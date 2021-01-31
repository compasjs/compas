import { readFile } from "fs/promises";
import { exec, mainFn, spawn } from "@compas/stdlib";
import axios from "axios";

mainFn(import.meta, main);

async function main(logger) {
  const [githubToken] = process.argv.slice(2);

  const newVersion = await getVersionFromGitLog();
  if (!/^\d+\.\d+\.\d+$/g.test(newVersion)) {
    logger.error(`Invalid version, found: ${newVersion}`);

    process.exit(1);
  }

  const { exitCode } = await spawn(`yarn`, [
    "lerna",
    "publish",
    "--exact",
    "--yes",
    newVersion,
  ]);

  if (exitCode !== 0) {
    process.exit(exitCode);
  }

  await addChangelogToGithubRelease(`v${newVersion}`, githubToken);
}

async function getVersionFromGitLog() {
  const { stdout } = await exec(`git log -1 --pretty=format:"%s"`);
  const versionString = stdout.trim().split(" ").pop();

  // Drop the 'v'
  return versionString.substring(1);
}

async function addChangelogToGithubRelease(version, githubToken) {
  const fullChangelog = await readFile("./changelog.md", "utf8");
  const changelogPart = parseChangelog(fullChangelog);

  await axios.request({
    url: "https://api.github.com/repos/compasjs/compas/releases",
    method: "POST",
    auth: {
      username: "github-actions[bot]",
      password: githubToken,
    },
    data: {
      tag_name: version,
      name: version,
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

  const parts = fullChangelog
    .substring(firstIndex, secondIndex)
    .trim()
    .split("\n");

  const result = [];
  let hasEmptyLine = false;

  for (let i = 1; i < parts.length; ++i) {
    const thisPart = parts[i].trim();

    // Start a new line on an empty line or a new bullet point
    if (thisPart.startsWith("-") || hasEmptyLine) {
      result.push(thisPart);
      hasEmptyLine = false;
    } else if (thisPart.length === 0) {
      hasEmptyLine = true;
      result.push("");
    } else {
      // Concatenate the different sentence parts together
      result[result.length - 1] += ` ${thisPart}`;
    }
  }

  return result.join("\n");
}
