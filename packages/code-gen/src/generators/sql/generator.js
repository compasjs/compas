import { dirnameForModule, pathJoin } from "@lbu/stdlib";
import { compileTemplateDirectory, executeTemplate } from "../../template.js";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { compileDynamicTemplates } from "../../utils.js";
import { buildExtraTypes } from "./builder.js";

/**
 * @name ObjectType#enableQueries
 *
 * @param {object} [options={}]
 * @param {boolean} [options.withHistory]
 * @param {boolean} [options.withDates]
 * @returns {ObjectType}
 */
TypeCreator.types.get("object").class.prototype.enableQueries = function (
  options = {},
) {
  this.data.enableQueries = true;
  this.data.queryOptions = options;
  return this;
};

/**
 * @name TypeBuilder#searchable
 * @returns {TypeBuilder}
 */
TypeBuilder.prototype.searchable = function () {
  this.data.sql = this.data.sql || {};
  this.data.sql.searchable = true;

  return this;
};

/**
 * @name TypeBuilder#primary
 * @returns {TypeBuilder}
 */
TypeBuilder.prototype.primary = function () {
  this.data.sql = this.data.sql || {};
  this.data.sql.searchable = true;
  this.data.sql.primary = true;

  return this;
};

export function init() {
  compileTemplateDirectory(
    pathJoin(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<void>}
 */
export async function preGenerate(app, { structure }) {
  buildExtraTypes(structure);
}

/**
 * @param {GenerateOpts} options
 */
function compileSqlExec(options) {
  if (options.dumpPostgres) {
    compileDynamicTemplates(options, "sql", {
      fnStringStart: `
  {{ let result = ''; }}
  {{ if (false) { }}
  `,
      fnStringAdd: (type, templateName) =>
        `{{ } else if (it.type === "${type.name}") { }}{{ result += ${templateName}({ ...it }).trim(); }}\n`,
      fnStringEnd: `
      {{ } else { }}
      {{ result += "JSONB"; }}
      {{ } }}
    {{= result.trim().replace(/\\s+/g, " ") }}
  `,
    });
  }
}

/**
 * @param {App} app
 * @param {GeneratorOptions} input
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, { structure, options }) {
  await compileSqlExec(options);

  if (options.dumpPostgres) {
    const result = executeTemplate("sqlPostgres", {
      structure,
      options,
    });

    app.logger.info(`\n${result}`);
  }

  return {
    path: "./queries.js",
    source: executeTemplate("sqlFile", {
      structure,
      options,
    }),
  };
}
