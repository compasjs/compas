import {
  ArrayValidator,
  BooleanValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  ReferenceValidator,
  StringValidator,
  Validator,
} from "../types";
import { buildError } from "./errors";
import { ValidatorMapping } from "./types";
import {
  createArrayType,
  createBooleanType,
  createNumberType,
  createObjectType,
  createOneOfType,
  createReferenceType,
  createStringType,
} from "./typings";

interface Context {
  helperFunctions: string[];
  namedFunctions: string[];
  mapping: ValidatorMapping;

  nextFunc(): string;
}

export function createFunctionsForSchemas(mapping: ValidatorMapping) {
  let funcIdx = 0;
  const helperFunctions: string[] = [];
  const namedFunctions: string[] = [];

  const ctx: Context = {
    nextFunc(): string {
      return `generated${funcIdx++}`;
    },

    helperFunctions,
    namedFunctions,
    mapping,
  };

  for (const s of Object.values(mapping)) {
    ctx.namedFunctions.push(createNamedFunctionForSchema(ctx, s));
  }

  return [
    getValidatorHooks(mapping),
    ctx.namedFunctions.join("\n"),
    ctx.helperFunctions.join("\n"),
  ].join("\n");
}

/**
 * I think this part of the codebase generates the most type hacks...
 * TODO: Maybe someone smarter than me can get some less @ts-ignores in this part of the
 *  generated code
 */
function getValidatorHooks(mapping: ValidatorMapping): string {
  const header = `
type GetHookReturnType<TDefault, Key> = Key extends keyof typeof hooks
  ? ReturnType<ValidationHooks[Key]>
  : TDefault;
`;

  const registerFn = `
export function registerValidatorHook<T extends keyof ValidationHooks>(
  key: T,
  cb: ValidationHooks[T],
): void {
  hooks[key] = cb;
}
`;

  let iface = `export interface ValidationHooks {\n`;
  let constHooks = `// @ts-ignore\nconst hooks: ValidationHooks = {\n`;

  const keys = Object.keys(mapping);

  for (const key of keys) {
    iface += `  preValidate${key}(value: unknown): unknown;\n`;
    constHooks += `  preValidate${key}: (value: unknown): unknown => {return value;},`;
  }

  iface += "}";
  constHooks += "};";

  return [header, iface, constHooks, registerFn].join("\n");
}

function createNamedFunctionForSchema(ctx: Context, schema: Validator): string {
  const fn = createFunction(ctx, schema);
  const name = schema.name!;

  return `
export function validate${name}(
  value: unknown,
): GetHookReturnType<${name}, "postValidate${name}"> {
  const preValue = hooks.preValidate${name}(value);
  const validatedValue = ${fn.name}(preValue, "$");

  if ("postValidate${name}" in hooks) {
    // @ts-ignore
    return hooks.postValidate${name}(validatedValue) as GetHookReturnType<
      ${name},
      "postValidate${name}"
    >;
  } else {
    // @ts-ignore
    return validatedValue as ${name};
  }
}
`;
}

function createFunction(ctx: Context, schema: Validator): { name: string } {
  switch (schema.type) {
    case "number":
      return createNumberFunction(ctx, schema);
    case "string":
      return createStringFunction(ctx, schema);
    case "boolean":
      return createBooleanFunction(ctx, schema);
    case "object":
      return createObjectFunction(ctx, schema);
    case "array":
      return createArrayFunction(ctx, schema);
    case "oneOf":
      return createOneOfFunction(ctx, schema);
    case "reference":
      return createReferenceFunction(ctx, schema);
  }

  return { name: ctx.nextFunc() };
}

function createNumberFunction(
  ctx: Context,
  schema: NumberValidator,
): { name: string } {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createNumberType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("number.undefined"));
    }
  }
  result.push("}");

  if (schema.convert) {
    result.push(`if (typeof value !== "number") {`);
    result.push(`  value = Number(value);`);
    result.push("}");
  }

  result.push(
    `if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {`,
  );
  result.push(buildError("number.type"));
  result.push("}");

  if (schema.integer) {
    result.push(`if (!Number.isInteger(value)) {`);
    result.push(buildError("number.integer"));
    result.push("}");
  }

  if (schema.min !== undefined) {
    result.push(`if (value < ${schema.min}) {`);
    result.push(`const min = "${schema.min}";`);
    result.push(buildError("number.min"));
    result.push("}");
  }

  if (schema.max !== undefined) {
    result.push(`if (value > ${schema.max}) {`);
    result.push(`const max = "${schema.max}";`);
    result.push(buildError("number.max"));
    result.push("}");
  }

  if (schema.oneOf) {
    result.push(
      `if (${schema.oneOf.map(it => `value !== ${it}`).join(" && ")}) {`,
    );
    result.push(`const oneOf = "${schema.oneOf.join(", ")}";`);
    result.push(buildError("number.oneOf"));
    result.push("}");
  }

  result.push(`return value;`);

  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createStringFunction(
  ctx: Context,
  schema: StringValidator,
): { name: string } {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createStringType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("string.undefined"));
    }
  }
  result.push("}");

  if (schema.convert) {
    result.push(`if (typeof value !== "string") {`);
    result.push(`  value = String(value);`);
    result.push("}");
  }

  result.push(`if (typeof value !== "string") {`);
  result.push(buildError("string.type"));
  result.push("}");

  // Store in intermediate variable so that we don't have to assign to unknown.
  // result has TS type string here, so `result = result.trim()` also keeps it as a
  // string, whereas `value = value.trim()` results in TS type of value -> 'unknown'.
  if (schema.trim || schema.upperCase || schema.lowerCase) {
    result.push("let result = value;");
  } else {
    result.push("const result = value;");
  }

  if (schema.trim) {
    result.push(`result = result.trim();`);
  }

  if (schema.min !== undefined) {
    result.push(`if (result.length < ${schema.min}) {`);
    result.push(`const min = "${schema.min}";`);
    result.push(buildError("string.min"));
    result.push("}");
  }

  if (schema.max !== undefined) {
    result.push(`if (result.length > ${schema.max}) {`);
    result.push(`const max = "${schema.max}";`);
    result.push(buildError("string.max"));
    result.push("}");
  }

  if (schema.upperCase) {
    result.push(`result = result.toUpperCase();`);
  }

  if (schema.lowerCase) {
    result.push(`result = result.toLowerCase();`);
  }

  if (schema.oneOf) {
    result.push(
      `if (${schema.oneOf.map(it => `result !== '${it}'`).join(" && ")}) {`,
    );
    result.push(`const oneOf = "${schema.oneOf.join(", ")}";`);
    result.push(buildError("string.oneOf"));
    result.push("}");
  }

  if (schema.pattern) {
    const patternSrc = `/${schema.pattern.source}/${schema.pattern.flags}`;
    result.push(`if (!${patternSrc}.test(result)) {`);
    result.push(buildError("string.pattern"));
    result.push("}");
  }

  result.push("return result;");
  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createBooleanFunction(
  ctx: Context,
  schema: BooleanValidator,
): { name: string } {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createBooleanType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("boolean.undefined"));
    }
  }
  result.push("}");

  if (schema.convert) {
    result.push(`if (typeof value !== "boolean") {`);
    {
      result.push(`if (value === "true" || value === 1) {`);
      result.push(`value = true;`);
      result.push("}");
      result.push(`else if (value === "false" || value === 0) {`);
      result.push(`value = false;`);
      result.push("}");
    }
    result.push("}");
  }

  result.push(`if (typeof value !== "boolean") {`);
  result.push(buildError("boolean.type"));
  result.push("}");

  if (schema.oneOf) {
    result.push(`if (value !== ${schema.oneOf[0]}) {`);
    result.push(`const oneOf = "${schema.oneOf[0]}";`);
    result.push(buildError("boolean.oneOf"));
    result.push("}");
  }

  result.push("return value;");
  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createObjectFunction(
  ctx: Context,
  schema: ObjectValidator,
): { name: string } {
  const funcName = ctx.nextFunc();

  const result: string[] = [];
  const returnType = createObjectType(schema);

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${returnType} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("object.undefined"));
    }
  }
  result.push("}");

  result.push(`if (typeof value !== "object") {`);
  result.push(buildError("object.type"));
  result.push("}");
  result.push(`const result: any = {};`);

  if (schema.strict !== undefined) {
    // Not that nice to use a '!' but am done with figuring it out for now...
    result.push(`const keySet = new Set(Object.keys(value!));`);
  }

  if (schema.keys) {
    for (const [key, value] of Object.entries(schema.keys)) {
      const { name } = createFunction(ctx, value);
      result.push(
        `result["${key}"] = ${name}((value as any)["${key}"], propertyPath + "." + "${key}");`,
      );
      if (schema.strict) {
        result.push(`keySet.delete("${key}");`);
      }
    }
  }

  if (schema.strict !== undefined) {
    result.push(`if (keySet.size !== 0) {`);
    result.push(`let extraKeys = "";`);
    result.push(`for (const v of keySet.keys()) { extraKeys += v + ","; }`);
    result.push(buildError("object.strict"));
    result.push("}");
  }

  result.push(`return result as (${returnType});`);
  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createArrayFunction(ctx: Context, schema: ArrayValidator) {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createArrayType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("array.undefined"));
    }
  }
  result.push("}");

  const { name } = createFunction(ctx, schema.values);

  if (schema.convert) {
    result.push(`if (!Array.isArray(value)) {`);
    result.push(`value = [value]`);
    result.push(`}`);
  }

  result.push(`if (!Array.isArray(value)) {`);
  result.push(buildError("array.type"));
  result.push("}");

  result.push(`const result: ${createArrayType(schema)} = []`);
  result.push(`for (let i = 0; i < value.length; ++i) {`);
  result.push(`result.push(${name}(value[i], propertyPath + "[" + i + "]"));`);
  result.push("}");

  result.push(`return result;`);

  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createOneOfFunction(ctx: Context, schema: OneOfValidator) {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createOneOfType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("oneOf.undefined"));
    }
  }
  result.push("}");

  result.push(`const errors: ValidationError[] = [];`);

  for (const s of schema.validators) {
    const { name } = createFunction(ctx, s);
    result.push(`try {`);
    result.push(`return ${name}(value, propertyPath);`);
    result.push(`} catch (e) {`);
    result.push(`errors.push(e);`);
    result.push(`}`);
  }

  result.push(`const stringErrors = errors.map(it => it.message);`);
  result.push(buildError("oneOf.type"));

  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}

function createReferenceFunction(ctx: Context, schema: ReferenceValidator) {
  const funcName = ctx.nextFunc();

  const result: string[] = [];

  result.push(
    `function ${funcName}(value: unknown, propertyPath: string): ${createReferenceType(
      schema,
    )} {`,
  );

  result.push(`if (isNil(value)) {`);
  {
    if (schema.optional) {
      result.push("return undefined;");
    } else {
      result.push(buildError("reference.undefined"));
    }
  }
  result.push("}");
  const { name } = createFunction(ctx, ctx.mapping[schema.ref]);
  result.push(`const result = ${name}(value, propertyPath);`);

  result.push(`return result as ${createReferenceType(schema)};`);
  result.push("}");

  ctx.helperFunctions.push(result.join("\n"));

  return { name: funcName };
}
