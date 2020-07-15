import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
  pathJoin,
} from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { compileDynamicTemplates } from "../../utils.js";
import { generatorTemplates } from "../index.js";
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

export async function init() {
  await compileTemplateDirectory(
    generatorTemplates,
    pathJoin(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );
}

/**
 * @param {App} app
 * @param data
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data) {
  buildExtraTypes(data);
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  await compileSqlExec(options);

  if (options.dumpPostgres) {
    const result = executeTemplate(generatorTemplates, "sqlPostgres", {
      ...data,
      options,
    });

    app.logger.info("\n" + result);
  }

  return {
    path: "./queries.js",
    source: executeTemplate(generatorTemplates, "sqlFile", {
      ...data,
      options,
    }),
  };
}

/**
 * @param {GenerateOpts} options
 */
function compileSqlExec(options) {
  if (options.dumpPostgres) {
    compileDynamicTemplates(generatorTemplates, options, "sql", {
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
