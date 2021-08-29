/**
 * @typedef UtilCommand
 * @property {"util"} type
 * @property {string} name
 * @property {string[]} arguments
 * @property {string} [error]
 */
/**
 * @typedef ExecCommand
 * @property {"exec"} type
 * @property {string} name
 * @property {string|undefined} script
 * @property {boolean} watch
 * @property {boolean} verbose
 * @property {string[]} nodeArguments
 * @property {string[]} execArguments
 */
/**
 * @typedef {UtilCommand|ExecCommand} ParsedArgs
 */
/**
 * @param {string[]} knownNodeArgs
 * @param {string[]} knownScripts
 * @param {string[]} args
 * @returns {ParsedArgs}
 */
export function parseArgs(knownNodeArgs: string[], knownScripts: string[], args: string[], ...args: any[]): ParsedArgs;
export type UtilCommand = {
    type: "util";
    name: string;
    arguments: string[];
    error?: string | undefined;
};
export type ExecCommand = {
    type: "exec";
    name: string;
    script: string | undefined;
    watch: boolean;
    verbose: boolean;
    nodeArguments: string[];
    execArguments: string[];
};
export type ParsedArgs = UtilCommand | ExecCommand;
//# sourceMappingURL=parse.d.ts.map