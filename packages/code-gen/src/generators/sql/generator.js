import {
  camelToSnakeCase,
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
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

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );

  if (options.dumpPostgres) {
    compileDynamicTemplates(app.templateContext, options, "sql", {
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

  app.templateContext.globals.camelToSnakeCase = camelToSnakeCase;

  buildExtraTypes(data);
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @returns {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  if (options.dumpPostgres) {
    const result = executeTemplate(app.templateContext, "sqlPostgres", {
      ...data,
      options,
    });

    app.logger.info("\n" + result);
  }

  return {
    path: "./queries.js",
    source: executeTemplate(app.templateContext, "sqlFile", {
      ...data,
      options,
    }),
  };
}
