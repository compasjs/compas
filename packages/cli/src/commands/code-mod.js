import { eventStart, eventStop, isNil, newEvent } from "@compas/stdlib";
import { codeModMap } from "../code-mod/constants.js";

const SUB_COMMANDS = ["list", "exec"];

/**
 * @param {Logger} logger
 * @param {UtilCommand} command
 * @returns {Promise<{ exitCode: number }>}
 */
export async function codeModCommand(logger, command) {
  const verboseIdx = command.arguments.indexOf("--verbose");

  const verbose = verboseIdx !== -1;

  const subCommand =
    verboseIdx === 0 ? command.arguments[1] : command.arguments[0];

  if (!SUB_COMMANDS.includes(subCommand)) {
    logger.error(
      `Unknown command: 'compas code-mod ${
        subCommand ?? ""
      }'. Please use one of ${SUB_COMMANDS.join(", ")}`,
    );
    return { exitCode: 1 };
  }

  if (subCommand === "list") {
    let str = `Available code-mods:\n`;
    for (const [key, value] of Object.entries(codeModMap)) {
      str += `- ${key}: ${value.description}`;
    }
    logger.info(str);

    return { exitCode: 0 };
  }

  // subCommand == 'exec'
  const codeModName = command.arguments[command.arguments.indexOf("exec") + 1];

  if (isNil(codeModName)) {
    logger.error(
      `Missing code-mod name to execute. To see a list of available code-mods use 'yarn compas code-mod list'. To execute a code-mod use 'yarn compas code-mod exec $name'.`,
    );
    return { exitCode: 1 };
  }

  const selectedCodeMod = codeModMap[codeModName];
  if (isNil(selectedCodeMod) && /^v\d+\.\d+\.\d+$/gi.test(codeModName)) {
    logger.info(`No code-mod for version ${codeModName}.`);

    return { exitCode: 0 };
  } else if (isNil(selectedCodeMod)) {
    logger.error(
      `Unknown code-mod '${codeModName}' provided. To see a list of available code-mods use 'yarn compas code-mod list'. To execute a code-mod use 'yarn compas code-mod exec $name'.`,
    );
    return { exitCode: 1 };
  }

  logger.info(
    `Executing '${codeModName}' code-mod.\nDescription: ${selectedCodeMod.description}`,
  );

  const event = newEvent(logger);
  eventStart(event, `cli.codeMod.${codeModName}`);

  await Promise.resolve(selectedCodeMod.exec(event, verbose));

  if (verbose) {
    // Only print call stack if verbose is set
    eventStop(event);
  }

  return {
    exitCode: 0,
  };
}
