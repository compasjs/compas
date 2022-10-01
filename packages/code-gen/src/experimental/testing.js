import { newLogger } from "@compas/stdlib";
import { TypeCreator } from "../builders/index.js";
import { Generator } from "./generator.js";

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
 * Error scenario's should provide their own structure and not default to this variant.
 *
 * @returns {import("./generated/common/types").ExperimentalStructure}
 */
function getDefaultStructure() {
  const generator = new Generator(newLogger({}));
  const T = new TypeCreator("basic");

  // Basic
  generator.add(
    T.bool("boolRequired"),
    T.bool("boolOptional").optional(),
    T.bool("boolOptionalAllowNull").allowNull(),
    T.bool("boolDefault").default(true),
    T.bool("boolOneOf").oneOf(true),
    T.bool("boolConvert").convert(),

    T.date("dateRequired"),
    T.date("dateOptional").optional(),
    T.date("dateOptionalAllowNull").allowNull(),
    T.date("dateDefault").default("new Date(0)"),
    T.date("dateDefaultToNow").defaultToNow(),
    T.date("dateMin").min("2020-01-01"),
    T.date("dateMax").max("2020-01-01"),
    T.date("dateInFuture").inTheFuture(),
    T.date("dateInPast").inThePast(),

    T.number("numberRequired"),
    T.number("numberOptional").optional(),
    T.number("numberOptionalAllowNull").allowNull(),
    T.number("numberDefault").default(5),
    T.number("numberOneOf").oneOf(1, 2, 3),
    T.number("numberConvert").convert(),
    T.number("numberFloat").float(),
    T.number("numberMin").min(5),
    T.number("numberMax").max(5),

    T.object("objectEmpty"),
    T.object("objectLoose").loose(),
    T.object("objectOptional").optional(),
    T.object("objectOptionalAllowNull").allowNull(),
    T.object("objectDefault").default(`{ region: "north" }`),
    T.object("objectKeys").keys({
      region: "north",
      isBusy: true,
      uplinkInGB: 40,
    }),
    T.object("objectNested").keys({
      object: {
        foo: "bar",
      },
    }),

    T.string("stringRequired"),
    T.string("stringOptional").optional(),
    T.string("stringOptionalAllowNull").allowNull(),
    T.string("stringDefault").default(`"north"`),
    T.string("stringOneOf").oneOf("north", "east", "south", "west"),
    T.string("stringConvert").convert(),
    T.string("stringMin").min(5),
    T.string("stringMax").max(5),
    T.string("stringLowercase").lowerCase(),
    T.string("stringUppercase").upperCase(),
    T.string("stringDisallowCharacters")
      .max(10)
      .disallowCharacters(["-", "\n"]),
    T.string("stringTrim").trim(),
    T.string("stringPattern").pattern(/^north$/gi),

    T.uuid("uuidRequired"),
    T.uuid("uuidOptional").optional(),
    T.uuid("uuidOptionalAllowNull").allowNull(),
    T.uuid("uuidDefault").default(`434ed696-e71d-49fa-b962-7e8c7b15a9e1`),
  );

  {
    const T = new TypeCreator("references");
    // References
    generator.add(
      T.bool("target"),

      T.object("simple").keys({
        target: T.reference("references", "target"),
      }),
      T.object("optional").keys({
        target: T.reference("references", "target").optional(),
      }),
      T.object("allowNull").keys({
        target: T.reference("references", "target").allowNull(),
      }),
      T.object("default").keys({
        target: T.reference("references", "target").default(true),
      }),

      T.object("nested").keys({
        referencing: T.reference("references", "simple"),
      }),
      T.object("targetRecursive").keys({
        referencing: T.reference("references", "targetRecursive").optional(),
      }),
    );
  }

  const outputFiles = generator.generate({
    targetLanguage: "js",
    generators: {
      structure: {},
    },
  });

  const outputFile = outputFiles.find(
    (it) => it.relativePath === "common/structure.json",
  );

  const parsed = JSON.parse(outputFile?.contents ?? "{}");
  delete parsed.compas?.$options;

  return parsed;
}
