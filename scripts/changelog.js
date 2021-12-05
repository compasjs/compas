import { readFile, writeFile } from "fs/promises";
import { exec, isNil, mainFn, pathJoin } from "@compas/stdlib";

mainFn(import.meta, main);

/**
 * @typedef {object} ChangelogCommit
 * @property {string} title  Full commit title
 * @property {string|undefined} [subject] Subject of the commit, like in conventional
 *    commits
 * @property {string|undefined} [message] Message in the title, not including subject
 * @property {string} body Full commit body
 * @property {string|undefined} [breakingChange] Commit body breaking change or major
 *    bumps
 * @property {string[]} notes Changelog notes
 */

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
  decorateCommits(commits);

  const changelogPath = pathJoin(process.cwd(), "changelog.md");
  const changelog = await readFile(changelogPath, "utf8");
  const { header, source } = getChangelogHeaderAndSource(changelog);
  const trimmedChangelog = stripChangelogOfUnreleased(source);
  const unreleasedChangelog = makeChangelog(logger, commits);

  await writeFile(
    changelogPath,
    `${header}\n\n${unreleasedChangelog}\n\n${trimmedChangelog}`,
    "utf8",
  );
}

/**
 * Uses `git log` to quickly get the first commit line of all commits since the provided
 * version
 *
 * @param {Logger} logger
 * @param {string} version
 * @returns {Promise<ChangelogCommit[]>}
 */
async function getListOfCommitsSinceTag(logger, version) {
  const { exitCode, stdout, stderr } = await exec(
    `git log v${version}..HEAD --no-decorate --pretty="format:%s%n%b%n commit-body-end %n"`,
  );

  if (exitCode !== 0) {
    logger.error("Could not determine commits");
    logger.error({ stdout, stderr });
    process.exit(exitCode);
  }

  return stdout
    .split("commit-body-end")
    .map((it) => it.trim())
    .map((it) => {
      const [title, ...body] = it.split("\n");

      return {
        title,
        body: body.join("\n").trim(),
        notes: [],
      };
    })
    .filter((it) => it.title?.length > 0)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Get changelog header including front matter
 *
 * @param {string} changelog
 * @returns {{ header: string, source: string }}
 */
function getChangelogHeaderAndSource(changelog) {
  const string = "# Changelog";
  const splitIndex = changelog.indexOf(string) + string.length + 1;

  return {
    header: changelog.substring(0, splitIndex),
    source: changelog.substring(splitIndex),
  };
}

/**
 * Remove initial changelog contents, including the already existing 'unreleased' part
 *
 * @param {string} changelog
 * @returns {string}
 */
function stripChangelogOfUnreleased(changelog) {
  let result = changelog.trim();

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
 *
 * @param {ChangelogCommit[]} commits
 * @returns {ChangelogCommit[]}
 */
function combineCommits(commits) {
  // build(deps): bump @types/node from 14.6.2 to 14.6.3
  // build(deps-dev): bump react-query from 2.12.1 to 2.13.0 (#234)
  const depRegex =
    /^build\((deps|deps-dev)\): bump ([\w\-@/]+) from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)(?:\s\(#(\d+)\))?$/g;

  const combinable = {};
  const result = [];

  for (let i = 0; i < commits.length; ++i) {
    const execResult = depRegex.exec(commits[i].title);
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
        body: commits[i].body,
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
    const { buildType, prs, fromVersion, toVersion, body } = combinable[pkg];

    if (buildType === "deps-dev") {
      // We don't need development dependency updates in the changelog
      continue;
    }

    // Format PR numbers so the writer can create correct urls
    const finalPrs =
      prs.length > 0 ? ` (${prs.map((it) => `#${it}`).join(", ")})` : "";

    result.push({
      title: `build(${buildType}): bump ${pkg} from ${fromVersion} to ${toVersion}${finalPrs}`,
      body,
      notes: [],
    });
  }

  return result.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Fill other 'ChangelogCommit' properties
 *
 * @param {ChangelogCommit[]} commits
 */
function decorateCommits(commits) {
  for (const commit of commits) {
    // feat(xxx,yy-zz):
    // feat(xxxx):
    // chore:
    const subjectMatch = commit.title.match(/^\w+(\(([\w,-]+)\))?: ([^#(]+)/i);

    if (subjectMatch?.[2]?.length > 0) {
      commit.subject = subjectMatch[2];
    }

    if (subjectMatch?.[3]?.length > 0) {
      commit.message = subjectMatch[3].trim();
    }

    if (commit.body.includes("BREAKING CHANGE:")) {
      let [, breakingChange] = commit.body.split("BREAKING CHANGE:");
      breakingChange = breakingChange.trim();

      if (breakingChange.length > 0) {
        commit.breakingChange = breakingChange;
      }
    }

    // build(deps): bump @types/node from 14.6.2 to 14.6.3
    // build(deps-dev): bump react-query from 2.12.1 to 2.13.0 (#234)
    const depsCommitMatch = commit.title.match(
      /^build\((deps|deps-dev)\): bump ([\w\-@/]+) from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)/i,
    );

    // depsCommitMatch[3] is the first mentioned version
    if (!isNil(depsCommitMatch) && !isNil(depsCommitMatch[3])) {
      const [, , , fromVersion, toVersion] = depsCommitMatch;

      if (semverIsMajor(fromVersion, toVersion)) {
        commit.breakingChange = `- Major version bump`;
      }
    }

    // Handling of the various ways of notes

    // We can have multiple 'Closes' or 'closes' in a commit
    if (
      commit.body.includes("References") ||
      commit.body.includes("references")
    ) {
      const refMatches = commit.body.matchAll(/References #(\d+)/gi);

      if (refMatches) {
        for (const match of refMatches) {
          commit.notes.push(`- References #${match[1]}`);
        }
      }
    }

    // We can have multiple 'Closes' or 'closes' in a commit
    if (commit.body.includes("Closes") || commit.body.includes("closes")) {
      const closeMatches = commit.body.matchAll(/Closes #(\d+)/gi);

      if (closeMatches) {
        for (const match of closeMatches) {
          commit.notes.push(`- Closes #${match[1]}`);
        }
      }
    }

    // Add link to release notes of dependencies
    if (commit.body.includes("- [Release notes]")) {
      const bodyParts = commit.body.split("\n");
      for (const part of bodyParts) {
        if (part.trim().startsWith("- [Release notes]")) {
          commit.notes.push(part.trim());
        }
      }
    }

    // Replace issue and pull references with a github url
    // We can always use 'pull', github will automatically redirect to issue if necessary
    const replacer = (obj, key) => {
      if (obj[key]) {
        obj[key] = obj[key].replace(
          /#(\d+)/g,
          `[#$1](https://github.com/compasjs/compas/pull/$1)`,
        );
      }
    };

    replacer(commit, "title");
    replacer(commit, "body");
    replacer(commit, "message");
    replacer(commit, "breakingChange");

    for (let i = 0; i < commit.notes.length; ++i) {
      replacer(commit.notes, i);
    }
  }
}

/**
 * Create the changelog based on the provided comits
 *
 * @param {Logger} logger
 * @param {ChangelogCommit[]} commits
 * @returns {string}
 */
function makeChangelog(logger, commits) {
  const result = [
    `### [vx.x.x](https://github.com/compasjs/compas/releases/tag/vx.x.x)`,
    ``,
    `##### Changes`,
    ``,
  ];

  const breakingChanges = [];

  for (const commit of commits) {
    result.push(`- ${commit.title}`);

    for (const note of commit.notes) {
      result.push(`  ${note}`);
    }

    if (commit.breakingChange) {
      breakingChanges.push(
        `- **${commit.subject ?? "all"}**: ${commit.message}`,
      );
      for (const line of commit.breakingChange.split("\n")) {
        breakingChanges.push(`  ${line}`);
      }
    }
  }

  if (breakingChanges.length > 0) {
    result.push(``, `##### Breaking changes`, ``);
    result.push(...breakingChanges);
  }

  result.push(
    "",
    "For a detailed description and more details about this release,\nplease read the [release notes](https://compasjs.com/releases/x.x.x.html).",
  );

  return result.join("\n");
}

/**
 * Basic semver check, does not work for all cases
 *
 * @param {string} first
 * @param {string} second
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

/**
 * Basic check if from first to second is a major version change.
 * 0.1.0 -> 0.1.1 = false
 * 0.1.0 -> 0.2.0 = true
 * 1.0.1 -> 1.1.0 = false
 * 1.0.1 -> 2.0.0 = true
 *
 * @param {string} first
 * @param {string} second
 */
function semverIsMajor(first, second) {
  const [firstMajor, firstMinor, firstPatch] = first
    .split(".")
    .map((it) => Number(it));
  const [secondMajor, secondMinor, secondPatch] = second
    .split(".")
    .map((it) => Number(it));

  if (secondMajor > firstMajor) {
    return true;
  }

  if (secondMajor === 0 && secondMinor > firstMinor) {
    return true;
  }

  return secondMajor === 0 && secondMinor === 0 && secondPatch > firstPatch;
}
