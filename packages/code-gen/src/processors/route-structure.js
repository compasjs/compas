import {
  AnyType,
  ObjectType,
  ReferenceType,
  RouteBuilder,
  StringType,
} from "../builders/index.js";
import { Generator } from "../generator.js";
import { openApiBuildFile } from "../open-api/generator.js";
import { structureRoutes } from "./routes.js";
import { structureAddType, structureNamedTypes } from "./structure.js";

/**
 * Cache the api structure string based on the current generate context.
 *
 * @type {WeakMap<object, string>}
 */
const routeStructureCache = new WeakMap();
/**
 * Cache the openapi structure string based on the current generate context.
 *
 * @type {WeakMap<object, string>}
 */
const openApiStructureCache = new WeakMap();

/**
 * Extract the route structure from generate context
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 */
export function routeStructureCreate(generateContext) {
  if (!generateContext.options.generators.router?.exposeApiStructure) {
    return;
  }

  const generator = new Generator(generateContext.log);
  generator.addStructure(JSON.parse(JSON.stringify(generateContext.structure)));

  // Remove relations, so the whole entity graph isn't included when an entity is used as
  // the respons type. Also disables `.enableQueries`. Both are necessary for
  // backwards compat with existing code-gen. It tries to write out all types instead of
  // only the selection necessary for an api client.
  for (const type of structureNamedTypes(generator.internalStructure)) {
    if (
      "relations" in type &&
      Array.isArray(type.relations) &&
      type.relations.length
    ) {
      type.relations = [];
    }

    if ("enableQueries" in type && type.enableQueries) {
      type.enableQueries = false;
    }
  }

  const selection = structureRoutes(generateContext).map((it) => ({
    group: it.group,
    name: it.name,
  }));

  const routesOnlyGenerator = generator.selectTypes(selection);

  routeStructureCache.set(
    generateContext,
    JSON.stringify(routesOnlyGenerator.internalStructure).replace(
      /([`\\])/gm,
      (v) => `\\${v}`,
    ),
  );
  openApiStructureCache.set(
    generateContext,
    JSON.stringify(
      openApiBuildFile({
        structure: routesOnlyGenerator.internalStructure,
        log: generateContext.log,
        files: new Map(),
        options: {
          targetLanguage: "js",
          generators: {
            openApi: {
              openApiExtensions: {},
              openApiRouteExtensions: {},
            },
          },
        },
      }),
    ).replace(/([`\\])/gm, (v) => `\\${v}`),
  );

  structureAddType(
    generateContext.structure,
    new ObjectType("compas", "structureQuery")
      .keys({
        format: new StringType().oneOf("compas", "openapi").default(`"compas"`),
      })
      .build(),
    {
      skipReferenceExtraction: false,
    },
  );
  structureAddType(
    generateContext.structure,
    new RouteBuilder("GET", "compas", "structure", "_compas/structure.json")
      .query(new ReferenceType("compas", "structureQuery"))
      .response(new AnyType())
      .tags("_compas")
      .docs("Return the full available API structure")
      .build(),
    {
      skipReferenceExtraction: false,
    },
  );
}

/**
 * Get the saved route structure
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {string}
 */
export function routeStructureGet(generateContext) {
  return routeStructureCache.get(generateContext) ?? "";
}

/**
 * Get the saved route structure in OpenApi format
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @returns {string}
 */
export function routeStructureGetOpenApi(generateContext) {
  return openApiStructureCache.get(generateContext) ?? "";
}
