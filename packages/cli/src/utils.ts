import { Command, CliContext } from "./types";

/**
 * Execute the provided command, if command is a function it is execute. If command is an
 * object, the first item of args is used to determine the next step. When it is not
 * available, defaultCommandName is used when available. Note that defaultCommandName is
 * passed down to recursive executions of this function
 */
export async function execCommand(
  ctx: CliContext,
  args: string[],
  command: Command,
  defaultCommandName?: string,
): Promise<void> {
  if (typeof command === "function") {
    return command(ctx, args);
  } else {
    const [arg, ...subArgs] = args;

    if (arg && arg in command) {
      return execCommand(ctx, subArgs, command[arg], defaultCommandName);
    } else if (defaultCommandName && defaultCommandName in command) {
      return execCommand(
        ctx,
        subArgs,
        command[defaultCommandName],
        defaultCommandName,
      );
    }
  }
}

export function getLbuVersion(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version } = require("../package");

  return version;
}
