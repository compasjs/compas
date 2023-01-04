import { TypeCreator } from "../../src/builders/index.js";
import { Generator } from "../../src/experimental/index.js";

export const specificationStructureDirectory =
  "./.cache/specification/generated";

/**
 * Generate the specification structure.
 *
 * @param {import("@compas/stdlib").Logger} logger
 */
export function codeGenSpecificationCreate(logger) {
  const generator = new Generator(logger);

  specificationExtendWithValidators(generator);

  generator.generate({
    targetLanguage: "js",
    outputDirectory: specificationStructureDirectory,
    generators: {
      structure: {},
    },
  });
}

/**
 * Create all validator types that are used in the specification.
 *
 *
 * @param {Generator} generator
 */
function specificationExtendWithValidators(generator) {
  const T = new TypeCreator("specificationValidator");

  generator.add(
    T.any("any"),
    T.any("anyOptional").optional(),

    T.anyOf("anyOf").values(true, false),
    T.anyOf("anyOfMixedPrimitive").values(T.number(), T.string()),
    T.anyOf("anyOfObjects").values({ type: "north" }, { type: "east" }),
    T.anyOf("anyOfNested").values(
      T.anyOf().values(1, 2),
      T.anyOf().values(true, false),
    ),

    T.array("array").values(true),
    T.array("arrayNested").values([true]),

    T.object("object").keys({
      foo: true,
    }),
    T.object("objectLoose")
      .keys({
        foo: true,
      })
      .loose(),
    T.object("objectNested").keys({
      foo: {
        bar: true,
      },
    }),

    T.string("string"),
    T.string("stringMinMax").min(5).max(10),
    T.string("stringOneOf").oneOf("north", "east"),
    T.string("stringAllowNull").allowNull(),
    T.string("stringOptional").optional(),
    T.string("stringPattern").pattern(/^\d+$/g),
    T.string("stringDisallowCharacters").disallowCharacters(["^", " "]).max(10),
  );
}
