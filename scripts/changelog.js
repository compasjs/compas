import { readFile, writeFile } from "fs/promises";
import { exec, isNil, mainFn, pathJoin } from "@compas/stdlib";

mainFn(import.meta, main);

/**
 * @typedef {object} ChangelogCommit
 * @property {string} title Full commit title
 * @property {string} hash The full commit hash
 * @property {string} body Full commit body
 * @property {string|undefined} [breakingChange] Commit body breaking change or major
 *   bumps
 * @property {string[]} notes Changelog notes
 */

/**
 * @param {Logger} logger
 */
async function main(logger) {
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

  const relevantCommits = commitsSinceLastVersion.filter((it) => {
    return (
      !it.title.includes("build(deps-dev)") &&
      !it.title.includes("@types/node") &&
      !it.title.includes("typescript-types group") &&
      !it.title.includes("sync generated doc files")
    );
  });

  const splitCommits = splitGroupedDependencyBumps(relevantCommits);
  const commits = combineCommits(splitCommits);

  decorateCommits(commits);

  const proposedVersion = proposeVersionBump(currentVersion, commits);
  const changelogPath = pathJoin(process.cwd(), "changelog.md");
  const changelog = await readFile(changelogPath, "utf8");
  const { header, existingChangelog } = getChangelogHeaderAndSource(changelog);
  const unreleasedChangelog = makeChangelog(logger, commits, proposedVersion);

  await writeFile(
    changelogPath,
    `${header}\n\n${unreleasedChangelog}\n\n${existingChangelog}`,
    "utf8",
  );
}

/**
 * Use `git log` to get the commits already separating the title from the commit body.
 *
 * @param {Logger} logger
 * @param {string} version
 * @returns {Promise<ChangelogCommit[]>}
 */
async function getListOfCommitsSinceTag(logger, version) {
  const { exitCode, stdout, stderr } = await exec(
    `git log v${version}..HEAD --no-decorate --pretty="format:%s%n%H%n%b%n commit-body-end %n"`,
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
      const [title, hash, ...body] = it.split("\n");

      return {
        title,
        hash,
        body: body.join("\n").trim(),
        notes: [],
      };
    })
    .filter((it) => it.title?.length > 0)
    .reverse();
}

/**
 * Get changelog header including front matter. We need to write our changes between the
 * returned header and source.
 *
 * @param {string} changelog
 * @returns {{ header: string, existingChangelog: string }}
 */
function getChangelogHeaderAndSource(changelog) {
  const string = "# Changelog";
  const splitIndex = changelog.indexOf(string) + string.length + 1;

  return {
    header: changelog.substring(0, splitIndex),
    existingChangelog: changelog.substring(splitIndex).trim(),
  };
}

/**
 * Split grouped dependency updates.
 *
 * @param {ChangelogCommit[]} commits
 * @returns {ChangelogCommit[]}
 */
function splitGroupedDependencyBumps(commits) {
  const result = [];

  // Updates `@aws-sdk/client-s3` from 3.369.0 to 3.370.0
  // Updates `@babel/eslint-parser` from 7.22.7 to 7.22.9
  const subDepStartMatch =
    /Updates `([\w\-@/]+)` from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)$/g;

  for (const commit of commits) {
    if (
      commit.title.includes("bump the") &&
      commit.title.includes("group with")
    ) {
      // Grouped commit
      const [, pr] = commit.title.match(/\(#(\d+)\)?/) ?? [];
      const lines = commit.body.split("\n");

      let dependency;
      let fromVersion;
      let toVersion;
      let body = "";

      const finishCommit = () => {
        if (dependency && body) {
          result.push({
            title: `build(deps): bump ${dependency} from ${fromVersion} to ${toVersion} (#${pr})`,
            hash: commit.hash,
            body,
            notes: [],
          });
        }

        dependency = undefined;
        fromVersion = undefined;
        toVersion = undefined;
        body = "";
      };

      for (const line of lines) {
        subDepStartMatch.lastIndex = -1;
        const [, dep, from, to] = subDepStartMatch.exec(line.trim()) ?? [];

        if (dep) {
          finishCommit();

          dependency = dep;
          fromVersion = from;
          toVersion = to;
        } else if (dependency) {
          body += `${line}\n`;
        }
      }

      finishCommit();
    } else {
      // Any other commit
      result.push(commit);
    }
  }

  return result;
}

/**
 * Tries to combine the dependency bump commits. This is useful for things like aws-sdk
 * which can have 10 bumps in a single Compas release.
 *
 * @param {ChangelogCommit[]} commits
 * @returns {ChangelogCommit[]}
 */
function combineCommits(commits) {
  // build(deps): bump @types/node from 14.6.2 to 14.6.3
  // build(deps-dev): bump react-query from 2.12.1 to 2.13.0 (#234)
  const depRegex =
    /^build\((deps)\): bump ([\w\-@/]+) from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)(?:\s\(#(\d+)\))?$/g;

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

    // Format PR numbers so the writer can create correct urls
    const finalPrs =
      prs.length > 0 ? ` (${prs.map((it) => `#${it}`).join(", ")})` : "";

    result.push({
      title: `build(${buildType}): bump ${pkg} from ${fromVersion} to ${toVersion}${finalPrs}`,
      body,
      notes: [],
    });
  }

  return result;
}

/**
 * Fill other 'ChangelogCommit' properties.
 *
 * - Breaking changes
 * - Inline commit references / closes
 * - Major version bumps
 *
 * @param {ChangelogCommit[]} commits
 */
function decorateCommits(commits) {
  for (const commit of commits) {
    if (
      commit.body.includes("BREAKING CHANGE:") ||
      commit.body.includes("BREAKING CHANGES:")
    ) {
      let [, breakingChange] = commit.body.split(/BREAKING CHANGES?:/i);
      breakingChange = breakingChange.trim();

      if (breakingChange.length > 0) {
        commit.breakingChange = breakingChange;
      }
    }

    // build(deps): bump @types/node from 14.6.2 to 14.6.3
    // build(deps-dev): bump react-query from 2.12.1 to 2.13.0 (#234)
    const depsCommitMatch = commit.title.match(
      /^build\((deps)\): bump ([\w\-@/]+) from (\d+\.\d+\.\d+) to (\d+\.\d+\.\d+)/i,
    );

    // depsCommitMatch[3] is the first mentioned version, if that one exists, we also
    // expect the second one to be there.
    if (!isNil(depsCommitMatch) && !isNil(depsCommitMatch[3])) {
      const [, , , fromVersion, toVersion] = depsCommitMatch;

      if (semverIsMajor(fromVersion, toVersion)) {
        commit.notes.push(`- Major version bump`);
      }
    }

    if (
      commit.body.includes("Reference") ||
      commit.body.includes("reference")
    ) {
      const refMatches = commit.body.matchAll(/References? #(\d+)/gi);

      if (refMatches) {
        // We can have multiple 'References' or 'references' in a commit
        for (const match of refMatches) {
          commit.notes.push(`- References #${match[1]}`);
        }
      }
    }

    if (commit.body.includes("Close") || commit.body.includes("close")) {
      const closeMatches = commit.body.matchAll(/Closes? #(\d+)/gi);

      if (closeMatches) {
        // We can have multiple 'Closes' or 'closes' in a commit
        for (const match of closeMatches) {
          commit.notes.push(`- Closes #${match[1]}`);
        }
      }
    }

    // Add a link to release notes of dependencies
    if (commit.body.includes("- [Release notes]")) {
      const bodyParts = commit.body.split("\n");
      for (const part of bodyParts) {
        if (part.trim().startsWith("- [Release notes]")) {
          commit.notes.push(part.trim());
        }
      }
    }

    // Replace issue and pull references with a GitHub url
    // We can always use 'pull', GitHub will automatically redirect to issue if necessary
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
 * Create the changelog based on the provided commits
 *
 * @param {Logger} logger
 * @param {ChangelogCommit[]} commits
 * @param {string} version
 * @returns {string}
 */
function makeChangelog(logger, commits, version) {
  const changelog = [
    `### [v${version}](https://github.com/compasjs/compas/releases/tag/v${version})`,
  ];

  const handledCommits = new Set();
  /**
   * @returns {ChangelogCommit[]}
   */
  const availableCommits = () =>
    commits.filter((it) => !handledCommits.has(it));

  // Write breaking changes
  if (availableCommits().find((it) => it.breakingChange)) {
    changelog.push(``);
    changelog.push(`#### Breaking changes`);
    changelog.push(``);
  }

  for (const commit of availableCommits()) {
    if (!commit.breakingChange) {
      continue;
    }

    handledCommits.add(commit);

    changelog.push(`- ${commit.title}${formatHash(commit)}`);

    for (const note of commit.notes) {
      changelog.push(`  ${note}`);
    }

    for (const line of commit.breakingChange.split("\n")) {
      changelog.push(`  ${line}`);
    }
  }

  // Write features
  if (availableCommits().find((it) => it.title.startsWith("feat"))) {
    changelog.push(``);
    changelog.push(`#### Features`);
    changelog.push(``);
  }

  for (const commit of availableCommits()) {
    if (!commit.title.startsWith("feat")) {
      continue;
    }

    handledCommits.add(commit);

    changelog.push(`- ${commit.title}${formatHash(commit)}`);

    for (const note of commit.notes) {
      changelog.push(`  ${note}`);
    }
  }

  // Write fixes
  if (availableCommits().find((it) => it.title.startsWith("fix"))) {
    changelog.push(``);
    changelog.push(`#### Bug fixes`);
    changelog.push(``);
  }

  for (const commit of availableCommits()) {
    if (!commit.title.startsWith("fix")) {
      continue;
    }

    handledCommits.add(commit);

    changelog.push(`- ${commit.title}${formatHash(commit)}`);

    for (const note of commit.notes) {
      changelog.push(`  ${note}`);
    }
  }

  // Write others
  // Everything that is left and is not a dependency bump can go here.
  if (availableCommits().find((it) => !it.title.startsWith("build(deps"))) {
    changelog.push(``);
    changelog.push(`#### Other`);
    changelog.push(``);
  }

  for (const commit of availableCommits()) {
    if (commit.title.startsWith("build(deps")) {
      continue;
    }

    handledCommits.add(commit);

    changelog.push(`- ${commit.title}${formatHash(commit)}`);

    for (const note of commit.notes) {
      changelog.push(`  ${note}`);
    }
  }

  // Write dependency bumps
  if (
    availableCommits().filter((it) => !it.title.includes("deps-dev")).length
  ) {
    changelog.push(``);
    changelog.push(`#### Dependency updates`);
    changelog.push(``);
  }

  for (const commit of availableCommits()) {
    if (commit.title.includes("deps-dev")) {
      continue;
    }

    changelog.push(`- ${commit.title}${formatHash(commit)}`);

    for (const note of commit.notes) {
      changelog.push(`  ${note}`);
    }
  }

  return changelog.join("\n");
}

/**
 * Format the commit hash, linking to the commit on GitHub.
 *
 * @param {ChangelogCommit} commit
 * @returns {string}
 */
function formatHash(commit) {
  if (!commit?.hash) {
    return "";
  }

  return ` [\`${commit.hash.slice(
    0,
    6,
  )}\`](https://github.com/compasjs/compas/commit/${commit.hash})`;
}

/**
 * Propose a new version based on the analyzed commits
 *
 * @param {string} version
 * @param {ChangelogCommit[]} commits
 * @returns {string}
 */
function proposeVersionBump(version, commits) {
  const hasBreakingChanges = commits.find(
    (it) =>
      it.breakingChange ||
      it.notes.find((note) => note === "- Major version bump"),
  );
  const hasFeat = commits.find((it) => it.title.startsWith("feat"));

  const type = hasBreakingChanges ? "major" : hasFeat ? "minor" : "patch";
  let [major, minor, patch] = version.split(".").map((it) => Number(it));

  if (type === "patch") {
    patch += 1;
  } else if (type === "minor") {
    if (major === 0) {
      patch += 1;
    } else {
      minor += 1;
      patch = 0;
    }
  } else if (type === "major") {
    if (major === 0 && minor === 0) {
      patch += 1;
    } else if (major === 0) {
      minor += 1;
      patch = 0;
    } else {
      major += 1;
      minor = 0;
      patch = 0;
    }
  }

  return [major, minor, patch].join(".");
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
