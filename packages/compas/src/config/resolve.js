import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isNil, pathJoin } from "@compas/stdlib";
import { validateCompasConfig } from "../generated/compas/validators.js";
import { debugTimeEnd, debugTimeStart } from "../output/debug.js";
import { output } from "../output/static.js";

/**
 * Try to load the config recursively from disk.
 *
 * Returns undefined when the config couldn't be loaded, for soft errors like no config
 * present, it returns a default empty config.
 *
 * @param {string} projectDirectory
 * @param {boolean} isRootProject
 * @returns {Promise<import("../generated/common/types.d.ts").CompasResolvedConfig|undefined>}
 */
export async function configResolve(projectDirectory, isRootProject) {
  const expectedFileLocation = pathJoin(projectDirectory, "config/compas.json");

  if (isRootProject) {
    debugTimeStart("config.resolve");
    output.config.resolve.starting();
  }

  if (!existsSync(expectedFileLocation)) {
    if (isRootProject) {
      output.config.resolve.creating();

      await mkdir(pathJoin(projectDirectory, "config"), { recursive: true });
      await writeFile(expectedFileLocation, JSON.stringify({}, null, 2));

      return await configResolve(projectDirectory, isRootProject);
    }

    output.config.resolve.notFound(expectedFileLocation);

    return {
      rootDirectory: projectDirectory,

      projects: [],
    };
  }

  const rawConfigContents = await readFile(expectedFileLocation, "utf-8");

  let parsedConfigContents = undefined;
  try {
    parsedConfigContents = JSON.parse(rawConfigContents);
  } catch (e) {
    output.config.resolve.parseError(e, expectedFileLocation);

    return undefined;
  }

  const { error, value } = validateCompasConfig(parsedConfigContents);

  if (error) {
    output.config.resolve.validationError(error, expectedFileLocation);

    return undefined;
  }

  const projects = value.projects
    ? await Promise.all(
        value.projects.map((it) =>
          configResolve(pathJoin(projectDirectory, it), false),
        ),
      )
    : [];

  if (projects.some((it) => isNil(it))) {
    // Can't resolve if a sub config returns undefined. The user is already notified.
    return undefined;
  }

  /** @type {import("../generated/common/types.d.ts").CompasResolvedConfig} */
  const resolvedConfig = {
    ...value,

    rootDirectory: projectDirectory,

    // @ts-expect-error
    projects,
  };

  if (isRootProject) {
    debugTimeEnd("config.resolve");
    output.config.resolve.resolved(resolvedConfig);
  }

  return resolvedConfig;
}
