import { readFile, rm, writeFile } from "node:fs/promises";

/**
 * Convert all known usages from @compas/lint-config to eslint-plugin
 *
 * @param {Logger} logger
 * @returns {Promise<void>}
 */
export async function executeLintConfigToEslintPlugin(logger) {
  await Promise.all([updatePackageJson(), updateEslintRc()]);

  logger.info(
    "Updated all configuration files. Run 'npm install && npx compas lint' to see if the newly applied rules report any issues.",
  );
}

async function updatePackageJson() {
  const pkgJson = JSON.parse(await readFile("./package.json", "utf-8"));

  const hasLintConfig = pkgJson.devDependencies["@compas/lint-config"];
  if (!hasLintConfig && !pkgJson.prettier) {
    return;
  }

  if (hasLintConfig) {
    delete pkgJson.devDependencies["@compas/lint-config"];

    pkgJson.devDependencies["@compas/eslint-plugin"] =
      pkgJson.dependencies["@compas/cli"] ??
      pkgJson.dependencies["@compas/cli"];
  }

  pkgJson.prettier = "@compas/eslint-plugin/prettierrc";

  await writeFile("./package.json", `${JSON.stringify(pkgJson, null, 2)}\n`);
}

async function updateEslintRc() {
  await rm("./.eslintrc", { force: true });
  await rm("./.eslintrc.js", { force: true });
  await rm("./.eslintrc.cjs", { force: true });

  await writeFile(
    "./.eslintrc",
    `${JSON.stringify({ extends: ["plugin:@compas/full"] }, null, 2)}\n`,
  );
}
