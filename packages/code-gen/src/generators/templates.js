import { inspect } from "util";
import { newTemplateContext } from "../../../stdlib/src/template.js";
import { getItem, lowerCaseFirst, upperCaseFirst } from "../utils.js";

/**
 * @type {TemplateContext}
 */
export const generatorTemplates = newTemplateContext();
generatorTemplates.strict = false;
generatorTemplates.globals.upperCaseFirst = upperCaseFirst;
generatorTemplates.globals.lowerCaseFirst = lowerCaseFirst;
generatorTemplates.globals.inspect = (arg) =>
  inspect(arg, { sorted: true, colors: false });
generatorTemplates.globals.getItem = (arg) => getItem(arg);
generatorTemplates.globals.objectToQueryString = () => `
function objectToQueryString(key, data, topLevel = true) {
  if (!Array.isArray(data) && typeof data !== "object") {
    // We don't need to concatenate the key if not top level
    if (topLevel) {
      return data;
    }
    return \`&\${key}=\${data}\`;
  }
  // Handling arrays
  // We don't have special support for empty arrays or objects
  if (Array.isArray(data)) {
    let result = "";
    for (let i = 0; i < data.length; ++i) {
      const subKey = \`\${key}[\${i}]\`;
      result += objectToQueryString(subKey, data[i], false);
    }
    return result;
  }
  let result = "";
  for (const dataKey of Object.keys(data)) {
    const subKey = \`\${key}[\${dataKey}]\`;
    result += objectToQueryString(subKey, data[dataKey], false);
  }
  return result;
}`;
