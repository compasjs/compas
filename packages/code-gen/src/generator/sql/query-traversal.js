import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/tag.js";
import { importCreator } from "../utils.js";
import { getPrimaryKeyWithType, getQueryEnabledObjects } from "./utils.js";

/**
 * Get other entities by following the relations across entities
 * @param {CodeGenContext} context
 */
export function generateTraversalQueries(context) {
  const traversePartials = [];
  const names = [];

  const imports = importCreator();
  imports.destructureImport("query", `@lbu/store`);

  for (const type of getQueryEnabledObjects(context)) {
    imports.destructureImport(
      `${type.name}Fields`,
      `./query-partials${context.importExtension}`,
    );
    imports.destructureImport(
      `${type.name}Where`,
      `./query-partials${context.importExtension}`,
    );
    imports.destructureImport(
      `${type.name}OrderBy`,
      `./query-partials${context.importExtension}`,
    );

    names.push(`traverse${upperCaseFirst(type.name)}`);
    traversePartials.push(traversalQuery(context, imports, type));
    // partials.push
  }

  const contents = js`
    ${imports.print()}

    ${traversePartials}
  `;

  context.rootExports.push(
    `export { ${names.join(", ")} } from "./query-traverser${
      context.importExtension
    }";`,
  );

  context.outputFiles.push({
    contents: contents,
    relativePath: `./query-traverser${context.extension}`,
  });

  context.types.imports.destructureImport("QueryPart", "@lbu/store");
  context.types.imports.destructureImport("Postgres", "@lbu/store");
}

/**
 * @param {CodeGenContext} context
 * @param {ImportCreator} imports
 * @param {CodeGenObjectType} type
 */
function traversalQuery(context, imports, type) {
  const partials = [];
  const docPartials = [];

  for (const relation of type.relations) {
    const { key: primaryKey } = getPrimaryKeyWithType(type);
    const otherSide = relation.reference.reference;

    const referencedKey =
      ["oneToMany", "oneToOneReverse"].indexOf(relation.subType) !== -1
        ? relation.referencedKey
        : getPrimaryKeyWithType(otherSide).key;

    const ownKey =
      ["manyToOne", "oneToOne"].indexOf(relation.subType) !== -1
        ? relation.ownKey
        : primaryKey;

    const part = js`
      /**
       * @param {${otherSide.uniqueName}Where} [where={}]
       * @returns {Traverse${upperCaseFirst(otherSide.name)}}
       */
      get${upperCaseFirst(relation.ownKey)}(where = {}) {
        where.${referencedKey}In = query\`
          SELECT ${type.shortName}."${ownKey}"
          FROM "${type.name}" ${type.shortName}
          WHERE $\{${type.name}Where(thisWhere)}
        \`;
        return traverse${upperCaseFirst(otherSide.name)}(where);
      },
    `;

    partials.push(part);
    docPartials.push(
      `get${upperCaseFirst(relation.ownKey)}: (where?: ${
        otherSide.uniqueName
      }Where) => Traverse${upperCaseFirst(otherSide.name)};`,
    );
  }

  context.types.rawTypes.push(`export interface Traverse${upperCaseFirst(
    type.name,
  )} {
  ${docPartials.join("\n")}
  queryPart: QueryPart;
  exec: (sql: Postgres) => Promise<${type.uniqueName}[]>;
}
  `);

  return js`
    /**
     * @param {${type.uniqueName}Where} [thisWhere={}]
     * @returns {Traverse${upperCaseFirst(type.name)}}
     */
    export function traverse${upperCaseFirst(type.name)}(thisWhere = {}) {
      return {
        ${partials}
        get queryPart() {
          return query\`
            SELECT $\{${type.name}Fields()}
            FROM "${type.name}" ${type.shortName}
            WHERE $\{${type.name}Where(thisWhere)}
            ORDER BY $\{${type.name}OrderBy()}
          \`;
        }, exec(sql) {
          return query\`
            SELECT $\{${type.name}Fields()}
            FROM "${type.name}" ${type.shortName}
            WHERE $\{${type.name}Where(thisWhere)}
            ORDER BY $\{${type.name}OrderBy()}
          \`.exec(sql);
        }
      };
    }
  `;
}
