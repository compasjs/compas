import { Logger } from "@lbu/insight";

export type Command =
  | ((ctx: CliContext, args: string[]) => void | Promise<void>)
  | { [str: string]: Command };

export interface Config {
  generate?: {
    inputFile?: string;
    outputDir?: string;
  };
}

export interface CliContext {
  logger: Logger;
  config?: Config;
}
