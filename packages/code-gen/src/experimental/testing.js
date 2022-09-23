/**
 * Create a CodeGen context for used for testing
 *
 * @param {Parameters<Parameters<typeof import("@compas/cli").test>[1]>[0]} t
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @param {import("./generated/common/types").ExperimentalStructure} [structure]
 * @returns {import("./generate").GenerateContext}
 */
export function testExperimentalGenerateContext(t, options, structure) {
  return {
    log: t.log,
    outputFiles: [],
    options,
    structure: structure ?? getDefaultStructure(),
  };
}

/**
 * Return a new structure that has coverage for most non error scenarios.
 *
 * @returns {import("./generated/common/types").ExperimentalStructure}
 */
function getDefaultStructure() {
  return {
    basic: {
      requiredBoolean: {
        type: "bool",
        group: "basic",
        name: "requiredBoolean",
        isOptional: false,
      },
    },
  };
}
