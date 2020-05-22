import { camelToSnakeCase } from "@lbu/stdlib";
import { addToData } from "../../generate.js";
import { TypeBuilder } from "../../types/index.js";

export function buildQueryTypes(data) {
  for (const group of Object.keys(data.structure)) {
    for (const name of Object.keys(data.structure[group])) {
      const item = data.structure[group][name];
      if (
        !item.enableQueries ||
        item.type !== "object" ||
        item._didSqlGenerate
      ) {
        continue;
      }
      const whereInfo = getWhereInfo(item);
      addToData(data, whereInfo.structure);

      const partialInfo = getPartialInfo(item);
      addToData(data, partialInfo.structure);

      const create = buildCreateFunction(item);
      addToData(data, create.structure);

      if (item.variants) {
        console.dir(item.variants, { colors: true, depth: 5 });
      }

      item._didSqlGenerate = true;
    }
  }
}

export function buildQueryData(data) {
  const result = {};

  for (const group of Object.keys(data.structure)) {
    for (const name of Object.keys(data.structure[group])) {
      const item = data.structure[group][name];
      if (!item.enableQueries || item.type !== "object") {
        continue;
      }

      if (!result[group]) {
        result[group] = {};
      }

      const whereInfo = getWhereInfo(item);
      addToData(data, whereInfo.structure);

      const partialInfo = getPartialInfo(item);
      addToData(data, partialInfo.structure);

      result[group][item.name + "Select"] = {
        type: "select",
        returning: item.uniqueName,
        where: whereInfo.structure.uniqueName,
        query: buildSelectQuery(item, whereInfo),
      };
      result[group][item.name + "Update"] = {
        type: "update",
        returning: item.uniqueName,
        where: whereInfo.structure.uniqueName,
        partial: partialInfo.structure.uniqueName,
        query: buildUpdateQuery(item, whereInfo),
      };

      result[group][item.name + "Delete"] = {
        type: "delete",
        where: whereInfo.structure.uniqueName,
        query: buildDeleteQuery(item, whereInfo),
      };

      const create = buildCreateFunction(item);
      addToData(data, create.structure);
      result[group][item.name + "Create"] = {
        type: "create",
        returning: item.uniqueName,
        input: create.structure.uniqueName,
        fnBody: create.fnBody,
      };
    }
  }

  return result;
}

function buildSelectQuery(table, where) {
  if (table.keys["file"]) {
    console.log(table.keys["file"], table);
  }
  return `SELECT ${Object.keys(table.keys).join(", ")} FROM ${camelToSnakeCase(
    table.name,
  )} ${where.queryPart}`;
}

function buildUpdateQuery(table, where) {
  return `UPDATE ${camelToSnakeCase(
    table.name,
  )} SET \${sql(partial, ...Object.keys(partial))} ${
    where.queryPart
  } RETURNING ${Object.keys(table.keys).join(", ")}`;
}

function buildDeleteQuery(table, where) {
  return `DELETE FROM ${camelToSnakeCase(table.name)} ${where.queryPart}`;
}

function buildCreateFunction(table) {
  const structure = {
    ...TypeBuilder.baseData,
    type: "object",
    group: table.group,
    name: table.name + "Create",
    keys: {},
  };

  let fnBody = ``;

  for (const key of Object.keys(table.keys)) {
    if (table.keys[key]?.sql?.primary) {
      continue;
    }

    structure.keys[key] = {
      ...table.keys[key],
      isOptional: table.keys[key].isOptional || !!table.keys[key].defaultValue,
      defaultValue: undefined,
    };

    if (table.keys[key].defaultValue !== undefined) {
      fnBody += `input.${key} = input.${key} || ${table.keys[key].defaultValue}; \n`;
    }
  }

  fnBody += `return sql\`INSERT INTO ${camelToSnakeCase(
    table.name,
  )} \${sql(input, ...Object.keys(input))} RETURNING ${Object.keys(
    table.keys,
  ).join(", ")}\`;`;

  return { structure, fnBody };
}

function getWhereInfo(table) {
  const keys = Object.keys(table.keys).filter(
    (it) =>
      !table.keys[it].isOptional &&
      (table.keys[it].sql?.searchable || table.keys[it].sql?.primary),
  );

  const structure = {
    ...TypeBuilder.baseData,
    type: "object",
    group: table.group,
    name: table.name + "Where",
    keys: {},
  };

  for (const key of keys) {
    structure.keys[key] = { ...table.keys[key], isOptional: true };
  }

  if (keys.length === 0) {
    throw new Error(
      "Can't generate safe queries without a primary key or searchable field",
    );
  }

  let queryPart = ``;

  for (const key of keys) {
    // Using COALESCE forces Postgres to evaluate the passed-in value as a PG value
    // instead of an identifier. The `xxx IS NULL` does not seem to incur a performance
    // regression in the execution plans
    queryPart += ` (COALESCE(\${where.${key}}, NULL) IS NULL OR ${key} = \${where.${key}}) AND`;
  }

  queryPart = "WHERE " + queryPart.substring(0, queryPart.length - 4).trim();

  return {
    structure,
    queryPart,
  };
}

function getPartialInfo(table) {
  const structure = {
    ...TypeBuilder.baseData,
    type: "object",
    group: table.group,
    name: table.name + "Partial",
    keys: {},
  };

  for (const key of Object.keys(table.keys)) {
    if (table.keys[key]?.sql?.primary) {
      continue;
    }
    structure.keys[key] = { ...table.keys[key], isOptional: true };
  }

  return { structure };
}
