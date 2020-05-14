import {
  compileTemplateDirectory,
  dirnameForModule,
  executeTemplate,
} from "@lbu/stdlib";
import { join } from "path";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { buildQueryData, buildQueryTypes } from "./builder.js";

/**
 * @name ObjectType#enableQueries
 * @return {ObjectType}
 */
TypeCreator.types.get("object").class.prototype.enableQueries = function () {
  this.data.enableQueries = true;
  return this;
};

/**
 * @name TypeBuilder#searchable
 * @return {TypeBuilder}
 */
TypeBuilder.prototype.searchable = function () {
  this.data.sql = this.data.sql || {};
  this.data.sql.searchable = true;

  return this;
};

/**
 * @name TypeBuilder#primary
 * @return {TypeBuilder}
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
 * @return {Promise<void>}
 */
export async function preGenerate(app, data, options) {
  await compileTemplateDirectory(
    app.templateContext,
    join(dirnameForModule(import.meta), "./templates"),
    ".tmpl",
  );

  buildQueryTypes(data, options);
}

/**
 * @param {App} app
 * @param data
 * @param {GenerateOpts} options
 * @return {Promise<GeneratedFile>}
 */
export async function generate(app, data, options) {
  data.sql = buildQueryData(data);
  return {
    path: "./queries.js",
    source: executeTemplate(app.templateContext, "sqlFile", {
      data: data.sql,
      options,
    }),
  };
}
