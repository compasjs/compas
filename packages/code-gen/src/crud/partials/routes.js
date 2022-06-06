/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 *   countBuilder: string,
 *   listBuilder: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteList = (data) => `
${data.handlerName} = async (ctx, next) => {
  const countBuilder = ${data.countBuilder};
  const { total, idIn } = await ${data.crudName}Count(newEventFromEvent(ctx.event), sql, countBuilder, ctx.validatedQuery);
  
  const listBuilder = ${data.listBuilder};
  listBuilder.where.idIn = idIn;
  const result = await ${data.crudName}List(newEventFromEvent(ctx.event), sql, listBuilder);
  
  ctx.body = {
    total,
    list: result.map(it => ${data.crudName}Transform(it)),
  };
  
  return next();
};
`;

/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 *   builder: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteSingle = (data) => `
${data.handlerName} = async (ctx, next) => {
  const builder = ${data.builder};
  const item = await ${data.crudName}Single(newEventFromEvent(ctx.event), sql, builder);
  
  ctx.body = {
    item: ${data.crudName}Transform(item),
  };
  
  return next();
};
`;

/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteCreate = (data) => `
${data.handlerName} = async (ctx, next) => {
  const item = await sql.begin(sql => ${data.crudName}Create(newEventFromEvent(ctx.event), sql, ctx.validatedBody));
  
  ctx.body = {
    item: ${data.crudName}Transform(item),
  };
  
  return next();
};
`;

/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 *   builder: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteUpdate = (data) => `
${data.handlerName} = async (ctx, next) => {
  const builder = ${data.builder};
  const item = await ${data.crudName}Single(newEventFromEvent(ctx.event), sql, builder);
  
  await sql.begin(sql => ${data.crudName}Update(newEventFromEvent(ctx.event), sql, item, ctx.validatedBody));
  
  ctx.body = {
    success: true,
  };
  
  return next();
};
`;

/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 *   builder: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteDelete = (data) => `
${data.handlerName} = async (ctx, next) => {
  const builder = ${data.builder};
  const item = await ${data.crudName}Single(newEventFromEvent(ctx.event), sql, builder);
  
  await sql.begin(sql => ${data.crudName}Delete(newEventFromEvent(ctx.event), sql, item));
  
  ctx.body = {
    success: true,
  };
  
  return next();
};
`;
