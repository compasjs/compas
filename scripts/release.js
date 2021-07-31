import { readFile, writeFile } from "fs/promises";
import {
  AppError,
  environment,
  exec,
  mainFn,
  pathJoin,
  spawn,
} from "@compas/stdlib";

mainFn(import.meta, main);

async function main() {
  const packages = [
    "lint-config",
    "stdlib",
    "cli",
    "code-gen",
    "server",
    "store",
  ];
  const version = process.argv[2];
  const otp = process.argv[3];

  checkVersionFormat(version);
  checkOtpFormat(otp);
  await checkCleanWorkingDirectory();

  for (const pkg of packages) {
    await bumpPackageJson(pkg, version.substring(1));
  }

  await spawn("git", ["commit", "-m", `${version}`]);
  await spawn("git", ["tag", "-a", version, "-m", `${version}`]);
  await spawn("git", ["push"]);
  await spawn("git", ["push", "origin", version]);

  for (const pkg of packages) {
    await spawn("npm", ["publish", "--access", "public"], {
      cwd: pathJoin(process.cwd(), "packages/", pkg),
      env: {
        ...environment,
        npm_config_registry: undefined,
        npm_config_otp: otp,
      },
    });
  }
}

async function bumpPackageJson(pkg, version) {
  const path = pathJoin(process.cwd(), "packages/", pkg, "package.json");
  const contents = JSON.parse(await readFile(path, "utf-8"));
  contents.version = version;

  for (const dep of Object.keys(contents.dependencies)) {
    if (dep.startsWith("@compas/")) {
      contents.dependencies[dep] = version;
    }
  }

  await writeFile(path, `${JSON.stringify(contents, null, 2)}\n`);
  await spawn("git", ["add", path]);
}

async function checkCleanWorkingDirectory() {
  const { exitCode } = await exec("git diff --exit-code");
  const { exitCode: exitCode2 } = await exec("git diff --cached --exit-code");

  if (exitCode !== 0 || exitCode2 !== 0) {
    throw AppError.serverError({
      message:
        "Working directory is not clean. Make sure to commit all your changes.",
    });
  }
}

/**
 * @param {string} version
 * @returns {void}
 */
function checkVersionFormat(version) {
  if (!/^v\d+\.\d+\.\d+$/gi.test(version)) {
    throw AppError.serverError({
      message: "Invalid version format",
      version,
    });
  }
}

/**
 * @param {string} version
 * @returns {void}
 */
function checkOtpFormat(version) {
  if (!/^\d{3,}$/gi.test(version)) {
    throw AppError.serverError({
      message: "Invalid otp format",
      version,
    });
  }
}
