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
generatorTemplates.globals.objectToQueryString = () =>
  `function objectToQueryString(key, data, depth = null, index = null) {
  // arrays
  if (Array.isArray(data)) {
    // empty array
    if (data.length === 0) {
      return "&";
    }

    const queryArray = [];
    for (let i = 0; i < data.length; i++) {
      queryArray.push(objectToQueryString(key, data[i], depth || [], i));
    }
    return queryArray.join("");
  }

  // objects
  if (typeof data === "object" && data !== null) {
    const identifier = \`&\${key}[\${index || 0}]\`;
    const objectString = Object.keys(data)
      .reduce((current, identifier) => {
        // push nested idenfiers, used to generate prefixes
        // for child nodes
        if(depth) {
          depth.push(identifier);
        }

        // cascade child
        current.push(
          \`[\${identifier}]=\${objectToQueryString(
            key,
            data[identifier],
            depth,
          )}\`,
        );
        return current;
      }, [])
      .join(identifier);

    return \`\${identifier}\${objectString}\`;
  }

  // array item
  if (typeof index == "number") {
    // transform depth list to string (with index and identifier)
    const depthIdentifiers = depth.reduce(
      (current, identifier, identifierIndex) =>
        \`\${current}[\${identifierIndex}][\${identifier}]\`,
      "",
    );

    return \`&\${key}\${depthIdentifiers}[\${index}]=\${data}\`;
  }

  return data;
}`;
