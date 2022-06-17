/**
 * @param {{
 *   handlerName: string,
 *   crudName: string,
 *   countBuilder: string,
 *   listBuilder: string,
 *   primaryKey: string,
 * }} data
 * @returns {string}
 */
export const crudPartialRouteList = (data) => `
${data.handlerName} = async (ctx, next) => {
  const countBuilder = ${data.countBuilder};
  
  countBuilder.orderBy = ctx.validatedBody.orderBy;
  countBuilder.orderBySpec = ctx.validatedBody.orderBySpec;
  
  const listBuilder = ${data.listBuilder};
  
  listBuilder.orderBy = ctx.validatedBody.orderBy;
  listBuilder.orderBySpec = ctx.validatedBody.orderBySpec;
  
  ${data.crudName}ListPreModifier && await ${data.crudName}ListPreModifier(newEventFromEvent(ctx.event), ctx, countBuilder, listBuilder);

  const { total, ${data.primaryKey}In } = await ${data.crudName}Count(newEventFromEvent(ctx.event), sql, countBuilder, ctx.validatedQuery);
  
  listBuilder.where.${data.primaryKey}In = ${data.primaryKey}In;
  
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
  
  ${data.crudName}SinglePreModifier && await ${data.crudName}SinglePreModifier(newEventFromEvent(ctx.event), ctx, builder);

  
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
 *   applyParams?: {
 *     bodyKey: string,
 *     paramsKey: string,
 *   },
 *   oneToOneChecks?: {
 *     builder: string,
 *   }
 * }} data
 * @returns {string}
 */
export const crudPartialRouteCreate = (data) => `
${data.handlerName} = async (ctx, next) => {
    ${
      data.oneToOneChecks
        ? `const builder = ${data.oneToOneChecks.builder};`
        : ``
    }
    ${data.crudName}CreatePreModifier && await ${
  data.crudName
}CreatePreModifier(newEventFromEvent(ctx.event), ctx ${
  data.oneToOneChecks ? `, builder` : ""
});

  ${
    data.applyParams
      ? `ctx.validatedBody.${data.applyParams.bodyKey} = ctx.validatedParams.${data.applyParams.paramsKey};`
      : ``
  }
  ${
    data.oneToOneChecks
      ? `
  try {
    const exists = await ${data.crudName}Single(newEventFromEvent(ctx.event), sql, builder);
    if (exists) {
      throw AppError.validationError("${data.crudName}.create.alreadyExists");
    }
  } catch (e) {
    if (e.key === "${data.crudName}.create.alreadyExists") {
      throw e;
    }
  }
`
      : ``
  }
  
  const item = await sql.begin(sql => ${
    data.crudName
  }Create(newEventFromEvent(ctx.event), sql, ctx.validatedBody));
  
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
  ${data.crudName}UpdatePreModifier && await ${data.crudName}UpdatePreModifier(newEventFromEvent(ctx.event), ctx, builder);

  
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
  ${data.crudName}DeletePreModifier && await ${data.crudName}DeletePreModifier(newEventFromEvent(ctx.event), ctx, builder);

  const item = await ${data.crudName}Single(newEventFromEvent(ctx.event), sql, builder);
  
  await sql.begin(sql => ${data.crudName}Delete(newEventFromEvent(ctx.event), sql, item));
  
  ctx.body = {
    success: true,
  };
  
  return next();
};
`;
