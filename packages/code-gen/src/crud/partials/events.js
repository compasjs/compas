import { isPlainObject } from "@compas/stdlib";
import { partialAsString } from "../../partials/helpers.js";
import { upperCaseFirst } from "../../utils.js";

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudCount = (data) => `
/**
 * Count function, resolving pagination parameters
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {${data.entityUniqueName}QueryBuilder} builder
 * @param {${upperCaseFirst(data.crudName)}ListQuery} queryParams
 * @returns {Promise<{ total: number, where: ${data.entityUniqueName}Where }>}
 */
export async function ${data.crudName}Count(event, sql, builder, queryParams) {
  eventStart(event, "${data.crudName}.count");
  
  const result  = await query${upperCaseFirst(
    data.entityName,
  )}(builder).exec(sql);
  
  const total = result.length;
  const slice = result.slice(queryParams.offset, queryParams.offset + queryParams.limit);
  
  eventStop(event);
  
  return { 
    total,
    where: {
     idIn: slice.map(it => it.id),
    }
  };
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudList = (data) => `
/**
 * List ${data.crudName} entities
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {${data.entityUniqueName}QueryBuilder} builder
 * @returns {Promise<QueryResult${data.entityUniqueName}[]>}
 */
export async function ${data.crudName}List(event, sql, builder) {
  eventStart(event, "${data.crudName}.list");
  
  const result  = await query${upperCaseFirst(
    data.entityName,
  )}(builder).exec(sql);
  
  eventStop(event);
  
  return result;
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudSingle = (data) => `
/**
 * Find a single ${data.crudName} entity
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {${data.entityUniqueName}QueryBuilder} builder
 * @returns {Promise<QueryResult${data.entityUniqueName}>}
 */
export async function ${data.crudName}Single(event, sql, builder) {
  eventStart(event, "${data.crudName}.single");
  
  const result  = await query${upperCaseFirst(
    data.entityName,
  )}(builder).exec(sql);
  
  if (result.length !== 1) {
    throw AppError.validationError("${data.crudName}.single.notFound");
  }
  
  eventStop(event);
  
  return result[0];
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudCreate = (data) => `
/**
 * Create a new ${data.crudName} entity
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {${upperCaseFirst(data.crudName)}CreateBody} body
 * @returns {Promise<QueryResult${data.entityUniqueName}>}
 */
export async function ${data.crudName}Create(event, sql, body) {
  eventStart(event, "${data.crudName}.create");
  
  // TODO: handle inline inserts
  
  const [{ id }] = await queries.${data.entityName}Insert(sql, body);
  const result = await ${
    data.crudName
  }Single(newEventFromEvent(event), sql, { where: { id } });
  
  eventStop(event);
  
  return result;
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudUpdate = (data) => `
/**
 * Update a ${data.crudName} entity
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResult${data.entityUniqueName}} entity
 * @param {${upperCaseFirst(data.crudName)}UpdateBody} body
 * @returns {Promise<void>}
 */
export async function ${data.crudName}Update(event, sql, entity, body) {
  eventStart(event, "${data.crudName}.update");
  
  // TODO: handle inline inserts
  
  await queries.${data.entityName}Update(sql, {
    update: body,
    where: {
      id: entity.id,
    }
  });
  
  eventStop(event);
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 * }} data
 * @returns {string}
 */
export const partialCrudDelete = (data) => `
/**
 * Delete a ${data.crudName} entity
 *
 * @param {InsightEvent} event
 * @param {Postgres} sql
 * @param {QueryResult${data.entityUniqueName}} entity
 * @returns {Promise<void>}
 */
export async function ${data.crudName}Delete(event, sql, entity) {
  eventStart(event, "${data.crudName}.delete");
  
  await queries.${data.entityName}Delete(sql, {
    id: entity.id,
  });
  
  eventStop(event);
}
`;

/**
 * @param {{
 *   crudName: string,
 *   entityUniqueName: string,
 *   entityName: string,
 *   entity: Record<string, boolean|Record<string, boolean>>
 * }} data
 * @returns {string}
 */
export const partialCrudTransformer = (data) => `
/**
 * Transform ${data.entityName} entity to the response type 
 *
 * @param {QueryResult${data.entityUniqueName}} input
 * @returns {${upperCaseFirst(data.crudName)}Item}
 */
export function ${data.crudName}Transform(input) {
  return {
    ${partialCrudFormatObject(data.entity, "input")}
  }
}
`;

const partialCrudFormatObject = (keys, source) =>
  partialAsString(
    Object.entries(keys).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${source}.${key}.map(it => ({
      ${partialCrudFormatObject(value[0], "it")}
    })),`;
      } else if (isPlainObject(value)) {
        return partialCrudFormatObject(value, `${source}.${key}`);
      }

      return `${key}: ${source}.${key},`;
    }),
  );
