/**
 * Use the provided name in JSDoc blocks
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {string} name
 * @returns {string}
 */
export function typesJavascriptUseTypeName(generateContext, file, name) {
  if (generateContext.options.generators.types?.declareGlobalTypes) {
    return name;
  }

  return `import("../common/types").${name}`;
}
