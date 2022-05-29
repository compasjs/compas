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
async function ${data.crudName}Count(event, sql, builder, queryParams) {
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
async function ${data.crudName}List(event, sql, builder) {
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
async function ${data.crudName}Single(event, sql, builder) {
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
async function ${data.crudName}Create(event, sql, body) {
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
async function ${data.crudName}Update(event, sql, entity, body) {
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
async function ${data.crudName}Delete(event, sql, entity) {
  eventStart(event, "${data.crudName}.delete");
  
  await queries.${data.entityName}Delete(sql, {
    id: entity.id,
  });
  
  eventStop(event);
}
`;
