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
  specificationExtendWithRouteMatchers(generator);

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
  const T = new TypeCreator("validator");

  generator.add(
    T.any("any"),
    T.any("anyOptional").optional(),
    T.any("anyStringLength").implementations({
      js: {
        validatorInputType: "any",
        validatorOutputType: "string",
        validatorExpression:
          "typeof $value$ === 'string' && $value$.length > 5",
      },
      ts: {
        validatorInputType: "any",
        validatorOutputType: "string",
        validatorExpression:
          "typeof $value$ === 'string' && $value$.length > 5",
      },
    }),
    T.any("anyWithImport").implementations({
      js: {
        validatorInputType: "any",
        validatorOutputType: "{}",
        validatorExpression: "lodash.isPlainObject($value$)",
        validatorImport: `import lodash from "lodash";`,
      },
      ts: {
        validatorInputType: "any",
        validatorOutputType: "{}",
        validatorExpression: "lodash.isPlainObject($value$)",
        validatorImport: `import lodash from "lodash";`,
      },
    }),

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

/**
 * Create all different routes to facilitate the route matcher specification.
 *
 * @param {Generator} generator
 */
function specificationExtendWithRouteMatchers(generator) {
  const T = new TypeCreator("routeMatcher");
  const R = T.router("/");

  generator.add(
    R.get("/", "base"),
    R.get("/static", "static"),
    R.get("/static/unused/1", "staticNested1"),
    R.get("/static/unused/2", "staticNested2"),

    R.get("/param/:foo", "paramSingle").params({
      foo: T.string(),
    }),
    R.get("/param/:foo/bar", "paramSingleNestedStatic").params({
      foo: T.string(),
    }),
    R.get("/param/:foo/:bar", "paramNested").params({
      foo: T.string(),
      bar: T.string(),
    }),

    R.get("/param-mixed/:foo/", "paramMixedBase").params({
      foo: T.string(),
    }),
    R.get("/param-mixed/:foo/foo", "paramMixedFoo").params({
      foo: T.string(),
    }),
    R.get("/param-mixed/:bar/bar", "paramMixedBar").params({
      bar: T.string(),
    }),

    R.get("/wildcard/*", "wildcardBase"),
    R.get("/wildcard/nested/*", "wildcardNested"),
  );
}
