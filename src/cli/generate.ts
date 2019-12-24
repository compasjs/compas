import { runCodeGen } from "../code-gen";
import { Logger } from "../insight";
import { load as lightbaseLoader } from "../loader";
import { lintCommand } from "./lint";

/**
 * Uses @lightbase/loader
 * Runs the code-gen & runs the lint command
 */
export async function generateCommand(logger: Logger) {
  // Needs to load config, let ../loader handle that
  lightbaseLoader();

  runCodeGen(logger);
  await lintCommand(logger);
}

generateCommand.help =
  "lbf generate -- Code generator\n\nGenerate code from config#codegen#input and write to config#codegen#output.\nNote that this will always overwrite the files in the output directory.\nIt will also lint the current project.";
