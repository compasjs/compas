import { benchCommand } from "./commands/bench.js";
import { codeModCommand } from "./commands/code-mod.js";
import {
  coverageCommand,
  dockerCommand,
  helpCommand,
  initCommand,
  lintCommand,
  proxyCommand,
  runCommand,
  testCommand,
  visualiseCommand,
} from "./commands/index.js";

const utilCommands = {
  help: helpCommand,
  init: initCommand,
  docker: dockerCommand,
  proxy: proxyCommand,
  "code-mod": codeModCommand,
  visualise: visualiseCommand,
};

const execCommands = {
  test: testCommand,
  bench: benchCommand,
  lint: lintCommand,
  run: runCommand,
  coverage: coverageCommand,
};

/**
 * @param {Logger} logger
 * @param {import("./parse").UtilCommand|import("./parse").ExecCommand} command
 * @param {import("./utils").ScriptCollection} scriptCollection
 * @returns {Promise<{ exitCode: number }|void>|void}
 */
export function execute(logger, command, scriptCollection) {
  if (command.type === "util") {
    const fn = utilCommands[command.name];
    if (fn) {
      return fn(logger, command, scriptCollection);
    }
  } else if (command.type === "exec") {
    const fn = execCommands[command.name];
    if (fn) {
      return fn(logger, command, scriptCollection);
    }
  }
}
