import {
  dockerCommand,
  helpCommand,
  initCommand,
  lintCommand,
  runCommand,
  testCommand,
} from "./commands/index.js";

const utilCommands = {
  help: helpCommand,
  init: initCommand,
  docker: dockerCommand,
};

const execCommands = {
  test: testCommand,
  lint: lintCommand,
  run: runCommand,
};

/**
 * @param {Logger} logger
 * @param {UtilCommand|ExecCommand} command
 * @param {ScriptCollection} scriptCollection
 * @returns {Promise<void>}
 */
export async function execute(logger, command, scriptCollection) {
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
