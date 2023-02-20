import { AppError, newLogger } from "@compas/stdlib";
import { TypeCreator } from "../builders/index.js";
import { generateExecute } from "./generate.js";
import { validateExperimentalGenerateOptions } from "./generated/experimental/validators.js";
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
    options,
    files: new Map(),
    structure: structure ?? getDefaultStructure(),
  };
}

/**
 * Fully run the generators and return the output files
 *
 * @param {Parameters<Parameters<typeof import("@compas/cli").test>[1]>[0]} t
 * @param {import("./generated/common/types").ExperimentalGenerateOptions} options
 * @param {import("./generated/common/types").ExperimentalStructure} [structure]
 * @returns {import("./generate").OutputFile[]}
 */
export function testExperimentalGenerateFiles(t, options, structure) {
  const context = testExperimentalGenerateContext(t, options, structure);
  const validatedOptions = validateExperimentalGenerateOptions(options);

  if (validatedOptions.error) {
    throw AppError.serverError({
      message: "Failed to validate options",
      validatedOptions,
    });
  }

  return generateExecute(
    new Generator(t.log).addStructure(context.structure),
    validatedOptions.value,
  );
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
    T.any("anyRequired"),
    T.any("anyOptional").optional(),
    T.any("anyOptionalAllowNull"),
    T.any("anyRawValue").raw("(string)"),
    T.any("anyRawValueImport").raw("QueryPart", {
      javaScript: `import("@compas/store").QueryPart`,
      typeScript: `import { QueryPart } from "@compas/store";`,
    }),

    T.anyOf("anyOfRequired").values(T.bool()),
    T.anyOf("anyOfOptional").values(T.bool()).optional(),
    T.anyOf("anyOfNestedOptional").values(T.string(), T.bool().optional()),
    T.anyOf("anyOfMultipleValues").values(T.bool(), T.number()),
    T.anyOf("anyOfNestedOptional").values(T.string(), T.bool().optional()),

    T.array("arrayRequired").values(T.bool()),
    T.array("arrayOptional").values(T.bool()).optional(),
    T.array("arrayOptionalAllowNull").values(T.bool()).allowNull(),
    T.array("arrayConvert").values(T.bool()),
    T.array("arrayMin").values(T.bool()).min(2),
    T.array("arrayMax").values(T.bool()).max(2),
    T.array("arrayConvert").values(T.bool()).convert(),

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
    T.date("dateSpecifierDate").dateOnly(),
    T.date("dateSpecifierTime").timeOnly(),

    T.file("fileRequired"),
    T.file("fileOptional").optional(),
    T.file("fileMimeTypes").mimeTypes("text/plain"),

    T.generic("generic").keys(T.string()).values(T.bool()),
    T.generic("genericOptional").keys(T.string()).values(T.bool()).optional(),
    T.generic("genericOptionalValue")
      .keys(T.string())
      .values(T.bool().optional()),
    T.generic("genericOneOfKeys")
      .keys(T.string().oneOf("up", "down", "left", "right"))
      .values(T.bool()),
    T.generic("genericDate").keys(T.date()).values(T.bool()),

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

    T.omit("omitFields")
      .object(
        T.object("omitBaseObject").keys({
          foo: T.bool(),
          bar: "baz",
        }),
      )
      .keys("bar"),
    T.omit("omitInlineFields")
      .object(
        T.object().keys({
          foo: T.bool(),
          bar: "baz",
        }),
      )
      .keys("bar"),

    T.pick("pickFields")
      .object(
        T.object("pickBaseObject").keys({
          foo: T.bool(),
          bar: "baz",
        }),
      )
      .keys("foo"),
    T.omit("pickInlineFields")
      .object(
        T.object().keys({
          foo: T.bool(),
          bar: "baz",
        }),
      )
      .keys("foo"),

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
    T.uuid("uuidDefault").default(`"434ed696-e71d-49fa-b962-7e8c7b15a9e1"`),
  );

  {
    const T = new TypeCreator("extend");

    generator.add(
      T.object("newKeys").keys({}),
      T.object("overwriteKeys").keys({
        foo: T.bool(),
      }),

      T.extendNamedObject(T.reference("extend", "newKeys")).keys({
        foo: T.bool(),
      }),
      T.extendNamedObject(T.reference("extend", "overwriteKeys")).keys({
        foo: T.number(),
      }),
    );
  }

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

  {
    const T = new TypeCreator("routes");
    const R = T.router("/");
    // Routes
    generator.add(
      R.get("/get", "get"),
      R.get("/get/:param", "getWithParam").params({
        param: T.uuid(),
      }),
      R.get("/get/query", "getWithQuery").query({
        limit: T.number().convert(),
      }),
      R.get("/return/reference", "getReturnReference").response(
        T.reference("references", "simple"),
      ),

      R.get("/get/:param/*", "getFull")
        .params({
          param: T.uuid(),
        })
        .response({
          success: true,
        }),

      R.get("/get/file/", "getFile").response(T.file()),

      R.post("/post", "post"),
      R.post("/post/idempotent", "postIdempotent")
        .idempotent()
        .body({
          data: {
            foo: T.bool(),
          },
        }),
      R.post("/post/full", "postFull")
        .body({
          enable: T.bool(),
        })
        .response({
          isEnabled: true,
        }),
      R.post("/post/form", "postForm")
        .body({
          enable: T.bool(),
        })
        .response({
          isEnabled: true,
        })
        .preferFormData(),
      R.post("/post/file", "postFile")
        .files({
          file: T.file(),
        })
        .response({}),

      // TODO: put, delete routes and file (post and fetch) routes

      R.get("/invalidation/list", "invalidationList"),
      R.get(
        "/invalidations/:invalidationId/single",
        "invalidationSingle",
      ).params({
        invalidationId: T.uuid(),
      }),
      R.post("/invalidations/create", "invalidationCreate").invalidations(
        R.invalidates(T.group),
      ),
      R.put("/invalidations/:invalidationId", "invalidationUpdate")
        .params({
          invalidationId: T.uuid(),
        })
        .invalidations(
          R.invalidates(T.group, "invalidationList"),
          R.invalidates(T.group, "invalidationSingle", {
            useSharedParams: true,
          }),
        ),
    );
  }

  {
    const T = new TypeCreator("database");
    // Database specific types

    generator.add(
      T.object("user")
        .keys({
          username: T.string().searchable(),
        })
        .enableQueries({
          withDates: true,
        })
        .relations(
          T.oneToMany("locations", T.reference("database", "location")),
          T.oneToMany("pets", T.reference("database", "pet")),
        ),

      T.object("location")
        .keys({
          name: T.string().searchable(),
          description: T.string(),
          country: T.string(),
          city: T.string(),
        })
        .enableQueries({
          withDates: true,
        })
        .relations(
          T.manyToOne(
            "owner",
            T.reference("database", "user"),
            "locations",
          ).optional(),

          T.oneToMany(
            "preferredLocationFor",
            T.reference("database", "petPreferredLocation"),
          ),
        ),

      T.object("locationInformation")
        .keys({
          isPublic: T.bool().default(false),
          isFencedAround: T.bool().sqlDefault(),
          squaredAreaInMeters: T.number().optional(),
        })
        .enableQueries({})
        .relations(
          T.oneToOne(
            "location",
            T.reference("database", "location"),
            "information",
          ),
        ),

      T.object("pet")
        .keys({
          species: T.string().oneOf("dog", "cat").searchable(),
          name: T.string(),
        })
        .enableQueries({
          withDates: true,
        })
        .relations(
          T.manyToOne("owner", T.reference("database", "user"), "pets"),

          T.oneToMany(
            "preferredLocations",
            T.reference("database", "petPreferredLocation"),
          ),
        ),

      T.object("petPreferredLocation")
        .keys({})
        .enableQueries({})
        .relations(
          T.manyToOne(
            "location",
            T.reference("database", "location"),
            "preferredLocationFor",
          ),
        ),

      T.extendNamedObject(
        T.reference(T.group, "petPreferredLocation"),
      ).relations(
        T.manyToOne(
          "pet",
          T.reference("database", "pet"),
          "preferredLocations",
        ),
      ),
    );
  }

  {
    // CRUD
    const Tpet = new TypeCreator("crudPet");
    const Tlocation = new TypeCreator("crudLocation");
    const Tuser = new TypeCreator("crudUser");

    generator.add(
      // All routes
      Tpet.crud("/crud/pet").entity(T.reference("database", "pet")).routes({
        listRoute: true,
        singleRoute: true,
        createRoute: true,
        updateRoute: true,
        deleteRoute: true,
      }),

      // Inline relation all routes
      Tlocation.crud("/crud/location")
        .entity(T.reference("database", "location"))
        .routes({
          listRoute: true,
          singleRoute: true,
          createRoute: true,
          updateRoute: true,
          deleteRoute: true,
        })
        .inlineRelations(
          Tlocation.crud()
            .fromParent("information")
            .fields({
              readable: {
                $omit: ["isPublic"],
              },
              writable: {
                $pick: ["isFencedAround", "squaredAreaInMeters"],
              },
            }),
        ),

      // Nested many-to-one
      Tuser.crud("/crud/user")
        .entity(T.reference("database", "user"))
        .routes({
          singleRoute: true,
        })
        .nestedRelations(
          Tuser.crud("/pets").fromParent("pets", { name: "pet" }).routes({
            listRoute: true,
          }),
        ),
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
