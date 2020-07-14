import { join } from "path";
import { App } from "@lbu/code-gen";
import { log } from "@lbu/insight";
import { mainFn } from "@lbu/stdlib";

mainFn(import.meta, log, main);

export const nodemonArgs = `--ignore generated --ignore stubs --ignore **/generated/*.js -e tmpl,js,json`;

/**
 *
 */
async function main() {
  const app = await App.new({
    verbose: true,
  });

  const enabledPackages = ["store"];
  const packagesDirectory = join(process.cwd(), "packages");

  const state = {};

  for (const pkg of enabledPackages) {
    state[pkg] = {
      sourcePath: join(packagesDirectory, pkg, "generate.js"),
      destPath: join(packagesDirectory, pkg, "src/generated"),
    };

    const imported = await import(state[pkg].sourcePath);
    if ("applyStructure" in imported) {
      imported.applyStructure(app);
    }
  }

  for (const pkg of enabledPackages) {
    await app.generate({
      outputDirectory: state[pkg].destPath,
      enabledGroups: [pkg],
      useStubGenerators: true,
      enabledGenerators: ["type", "sql"],
      useTypescript: false,
      dumpStructure: true,
      dumpPostgres: true,
    });
  }
}
