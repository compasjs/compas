import { inspect } from "util";
import { newTemplateContext } from "../../../stdlib/src/template.js";
import { lowerCaseFirst, upperCaseFirst } from "../utils.js";

/**
 * Shared templateContext for all generators
 *
 * @type {TemplateContext}
 */
export const generatorTemplates = newTemplateContext();
generatorTemplates.strict = false;
generatorTemplates.globals.upperCaseFirst = upperCaseFirst;
generatorTemplates.globals.lowerCaseFirst = lowerCaseFirst;
generatorTemplates.globals.inspect = (arg) =>
  inspect(arg, { sorted: true, colors: false });
