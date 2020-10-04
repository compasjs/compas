import { readFile, writeFile } from "fs/promises";
import { exec, isNil, mainFn, pathJoin } from "@lbu/stdlib";

mainFn(import.meta, main);

/**
 * @param {Logger} logger
 */
async function main(logger) {
  // Used for getting commits since last release
  const currentVersion = JSON.parse(
    await readFile(
      pathJoin(process.cwd(), "packages/stdlib/package.json"),
      "utf8",
    ),
  ).version;

  const commitsSinceLastVersion = await getListOfCommitsSinceTag(
    logger,
    currentVersion,
  );
  const commits = combineCommits(commitsSinceLastVersion);

  const changelogPath = pathJoin(process.cwd(), "docs/changelog.md");
  const changelog = await readFile(changelogPath, "utf8");
  const trimmedChangelog = stripChangelogOfUnreleased(changelog);
  const unreleasedChangelog = makeChangelog(logger, commits);

  await writeFile(
    changelogPath,
    `# CHANGELOG\n\n${unreleasedChangelog}\n\n${trimmedChangelog}`,
    "utf8",
  );
}

/**
 * Uses `git log` to quickly get the first commit line of all commits since the provided
 * version
 * @param {Logger} logger
 * @param {string} version
 * @returns {Promise<string[]>}
 */
async function getListOfCommitsSinceTag(logger, version) {
  const { exitCode, stdout, stderr } = await exec(
    `git log v${version}..HEAD --no-decorate --pretty="format:%s"`,
  );

  if (exitCode !== 0) {
    logger.error("Could not determine commits");
    logger.error({ stdout, stderr });
    process.exit(exitCode);
  }

  return stdout
    .split("\n")
    .map((it) => it.trim())
    .filter((it) => it.length !== 0)
    .sort();
}

/**
 * Remove initial changelog contents, including the already existing 'unreleased' part
 * @param {string} changelog
 * @returns {string}
 */
function stripChangelogOfUnreleased(changelog) {
  let result = changelog.substr("changelog".length + 2).trim();

  if (result.indexOf("### [vx.x.x") !== -1) {
    result = result.substr(
      result.indexOf("### [v", result.indexOf("### [vx.x.x") + 1),
    );
  }

  return result.trim();
}

/**
 * Tries to combine the dependency bump commits
 * Resorts before returning the new array
 * @param {string[]} commits
 * @returns {string[]}
 */
function combineCommits(commits) {
  // build(deps): bump @types/node from 14.6.2 to 14.6.3
  // build(deps-dev): bump react-query from 2.12.1 to 2.13.0 (#234)
  const depRegex = /^build\((deps|deps-dev)\): bump ([\w\-@/]+) from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)(?:\s\(#(\d+)\))?$/g;

  const combinable = {};
  const result = [];

  for (let i = 0; i < commits.length; ++i) {
    const execResult = depRegex.exec(commits[i]);
    depRegex.lastIndex = -1;
    if (isNil(execResult)) {
      result.push(commits[i]);
      continue;
    }

    const [, buildType, pkg, fromVersion, toVersion, pr] = execResult;
    if (isNil(combinable[pkg])) {
      combinable[pkg] = {
        buildType,
        prs: [],
        fromVersion,
        toVersion,
      };
    }

    if (pr) {
      combinable[pkg].prs.push(pr);
    }

    if (semverCheckHigher(fromVersion, combinable[pkg].fromVersion) === false) {
      combinable[pkg].fromVersion = fromVersion;
    }

    if (semverCheckHigher(toVersion, combinable[pkg].toVersion)) {
      combinable[pkg].toVersion = toVersion;
    }
  }

  for (const pkg of Object.keys(combinable)) {
    const { buildType, prs, fromVersion, toVersion } = combinable[pkg];

    // Format PR numbers so the writer can create correct urls
    const finalPrs =
      prs.length > 0 ? ` (${prs.map((it) => `#${it}`).join(", ")})` : "";

    result.push(
      `build(${buildType}): bump ${pkg} from ${fromVersion} to ${toVersion}${finalPrs}`,
    );
  }

  return result.sort();
}

/**
 *
 * @param {Logger} logger
 * @param {string[]} commits
 * @returns {string}
 */
function makeChangelog(logger, commits) {
  const result = [
    `### [vx.x.x](https://github.com/lightbasenl/lbu/releases/tag/vx.x.x)`,
    ``,
  ];

  for (const commit of commits) {
    // Replaces PR numbers with url's so they are also correctly linked from outside
    // Github
    result.push(
      `- ${commit.replace(
        /#(\d+)/g,
        `[#$1](https://github.com/lightbasenl/lbu/pull/$1)`,
      )}`,
    );
  }

  result.push(
    "",
    "For a detailed description and more details about this release,\nplease read the [release notes](https://lbu.lightbase.nl/releases/x.x.x.html).",
  );

  return result.join("\n");
}

/**
 * Basic semver check, does not work for all cases
 * @param first
 * @param second
 */
function semverCheckHigher(first, second) {
  const [firstMajor, firstMinor, firstPatch] = first
    .split(".")
    .map((it) => Number(it));
  const [secondMajor, secondMinor, secondPatch] = second
    .split(".")
    .map((it) => Number(it));

  if (firstMajor > secondMajor) {
    return true;
  }

  if (firstMinor > secondMinor && firstMajor >= secondMajor) {
    return true;
  }

  return (
    firstPatch > secondPatch &&
    firstMinor >= secondMinor &&
    firstMajor >= secondMajor
  );
}
