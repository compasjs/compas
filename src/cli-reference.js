import { writeFile } from "node:fs/promises";
import { newEvent } from "@compas/stdlib";
import { cliParserGetKnownFlags } from "../packages/cli/src/cli/parser.js";
import { compasGetCli } from "../packages/cli/src/compas/cli.js";

export async function syncCliReference(logger) {
  const event = newEvent(logger);
  const { cli } = await compasGetCli(event, {
    commandDirectories: {
      loadScripts: false,
      loadProjectConfig: false,
      loadUserConfig: false,
    },
  });

  const src = formatMarkdown(cli, {
    level: 1,
    prefix: "",
  });

  await writeFile("./docs/references/cli.md", src);
}

/**
 *
 * @param {import("../packages/cli/src/cli/types").CliResolved} command
 * @param {{
 *   level: number,
 *   prefix: "",
 * }} options
 * @returns {string}
 */
function formatMarkdown(command, options) {
  const commandString = `${options.prefix} ${
    command.modifiers.isDynamic ? "$" : ""
  }${command.name}`.trim();
  let src = `${"#".repeat(options.level)} \`${commandString}\`\n\n`;

  src += command.shortDescription;
  src += "\n\n";

  if (command.longDescription) {
    src += command.longDescription;
    src += "\n\n";
  }

  src += "| Option | Description |\n";
  src += "| --- | --- |\n";
  for (const flag of cliParserGetKnownFlags(command).values()) {
    if (flag.modifiers.isInternal) {
      continue;
    }

    if (flag.rawName === "-h") {
      continue;
    }

    if (flag.rawName === "--help") {
      flag.rawName = "-h, --help";
    }
    src += `| ${flag.rawName} | ${flag.description} (${
      flag.value.specification
    }${flag.modifiers.isRepeatable ? "[]" : ""}${
      flag.modifiers.isRequired ? ", required" : ""
    }) |\n`;
  }
  src += "\n\n";

  if (["help", "watch"].includes(command.name)) {
    return src;
  }

  for (const cmd of command.subCommands) {
    src += formatMarkdown(cmd, {
      level: options.level + 1,
      prefix: commandString,
    });
  }

  return src;
}
