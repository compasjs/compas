import { TypeCreator } from "@compas/code-gen";
import { packages } from "../src/doc-parser/packages.js";

/**
 * @param {App} app
 */
export function extendWithRepo(app) {
  extendWithDocParser(app);
}

/**
 * @param {App} app
 */
export function extendWithDocParser(app) {
  const T = new TypeCreator("docParser");

  const packageType = T.string("package").oneOf(...packages);

  const rangeType = T.object("range")
    .keys({
      start: T.number(),
      end: T.number(),
      pkg: packageType,
      file: T.string(),
      line: T.string().optional(),
    })
    .optional();

  app.add(
    T.object("JSComment").keys({
      type: T.string().oneOf("MultiLine", "SingleLine"),
      value: T.string(),
      range: rangeType,
    }),

    T.anyOf("type").values(
      T.object("literalType").keys({
        type: "literal",
        value: T.string(),
        isOptional: T.bool().optional(),
        defaultValue: T.string().optional(),
        isDocBlockReference: T.bool().optional(),
      }),
      T.object("functionType").keys({
        type: "function",
        params: [
          {
            name: T.string(),
            description: T.string(),
            type: T.reference("docParser", "type"),
          },
        ],
        returnType: T.reference("docParser", "type"),
      }),
    ),

    T.anyOf("block").values(
      T.object("unknownBlock").keys({
        type: "unknown",
        raw: T.string(),
        range: rangeType,
      }),
      T.object("functionDeclarationBlock").keys({
        type: "functionDeclaration",
        name: T.string().optional(),
        summary: T.string().optional(),
        description: T.string().optional(),
        availableSince: T.string().optional(),
        isVariable: T.bool(),
        parsedType: T.reference("docParser", "functionType"),
        range: rangeType,
      }),
    ),
  );
}
