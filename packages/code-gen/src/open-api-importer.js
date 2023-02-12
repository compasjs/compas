// @ts-nocheck

import { isNil, newLogger } from "@compas/stdlib";
import {
  AnyOfType,
  AnyType,
  ArrayType,
  BooleanType,
  DateType,
  FileType,
  GenericType,
  NumberType,
  ObjectType,
  ReferenceType,
  StringType,
  TypeBuilder,
  UuidType,
} from "./builders/index.js";
import { lowerCaseFirst, upperCaseFirst } from "./utils.js";

/**
 * Try some 'free'-form conversion
 * A lot of things are not mappable between the structures, and some have a different
 * meaning between OpenAPI and Compas.
 * We convert the routes first, using the first tag where possible, else the default
 * group. We then try to resolve the path-params and query params. Followed by the
 * request body and 200-response. There are some extra generated references to make sure
 * all path's are also referenced into the default group as to make sure they will be
 * included in the generation.
 *
 * @param {string} defaultGroup
 * @param {Record<string, any>} data
 */
export function convertOpenAPISpec(defaultGroup, data) {
  if (!data?.openapi?.startsWith("3.")) {
    throw new Error("Only openapi spec version 3 is (partially) supported");
  }

  const result = {
    [lowerCaseFirst(defaultGroup)]: {},
  };

  /**
   * @type {{
   *   logger: Logger,
   *   result: CompasStructure,
   *   defaultGroup: string,
   *   data: any,
   *   crossReferences: any[],
   *   openAPIReferences: any[],
   * }}
   * crossReferences are used to link routes to the default group
   *
   * openAPIReferences to resolve $ref's in the document
   */
  const context = {
    logger: newLogger({
      ctx: {
        type: "code_gen",
      },
    }),
    result,
    defaultGroup: lowerCaseFirst(defaultGroup),
    data,
    crossReferences: [],
    openAPIReferences: [],
  };

  // Naively extract routes
  for (const path of Object.keys(data.paths || {})) {
    for (const method of Object.keys(data.paths[path])) {
      extractRoute(context, path, method);
    }
  }

  // Generate refs for all routes that operate in a different group
  for (const ref of context.crossReferences) {
    const generatedRef = {
      ...ReferenceType.getBaseData(),
      type: "reference",
      group: defaultGroup,
      name: `ref${upperCaseFirst(ref.name)}`,
      reference: {
        ...ref,
        uniqueName: upperCaseFirst(ref.group) + upperCaseFirst(ref.name),
      },
    };

    context.result[context.defaultGroup][generatedRef.name] = generatedRef;
  }

  for (const ref of context.openAPIReferences) {
    const refValue = resolveReferenceAndConvert(context, ref);
    if (refValue) {
      context.result[context.defaultGroup][refValue.name] = refValue;
    }
  }

  return context.result;
}

/**
 * @param context
 * @param path
 * @param method
 */
function extractRoute(context, path, method) {
  const item = context.data.paths[path][method];
  if (!item) {
    return;
  }

  // Use tags[0] for the group or the defaultGroup
  const compasStruct = {
    ...TypeBuilder.getBaseData(),
    type: "route",
    group: transformRouteName(item.tags?.[0] ?? context.defaultGroup),
    name: transformRouteName(item.operationId ?? upperCaseFirst(method) + path),
    docString: item.description ?? "",
    method: method.toUpperCase(),
    path: transformRoutePath(path),
    tags: [],
  };

  if (context.defaultGroup !== compasStruct.group) {
    context.crossReferences.push({
      name: compasStruct.name,
      group: compasStruct.group,
    });
  }

  // OpenAPI has the path & query params in a single list
  compasStruct.query = transformQueryOrParams(
    context,
    item.parameters || [],
    compasStruct,
    "query",
  );
  compasStruct.params = transformQueryOrParams(
    context,
    item.parameters || [],
    compasStruct,
    "path",
  );

  let contentKey = "application/json";
  compasStruct.metadata = {
    requestBodyType: "json",
  };
  compasStruct.internalSettings = {
    requestBodyType: "json",
    stripTrailingSlash: !path.endsWith("/"),
  };

  if (
    isNil(item.requestBody?.content?.["application/json"]) &&
    !isNil(item.requestBody?.content?.["multipart/form-data"])
  ) {
    contentKey = "multipart/form-data";
    compasStruct.internalSettings.requestBodyType = "form-data";
    compasStruct.metadata.requestBodyType = "form-data";
  }

  const body = transformBody(
    context,
    contentKey,
    item.requestBody,
    compasStruct,
  );

  if (body && JSON.stringify(body).includes(`type":"file"`)) {
    compasStruct.files = body;
  } else {
    compasStruct.body = body;
  }

  compasStruct.response = transformResponse(
    context,
    item.responses?.["200"] ?? item.responses?.["201"],
    compasStruct,
  );

  context.result[compasStruct.group] = context.result[compasStruct.group] || {};
  context.result[compasStruct.group][compasStruct.name] = compasStruct;
}

/**
 * Remove spaces, dashes and return camelCased name
 *
 * @param operationId
 * @returns {string}
 */
function transformRouteName(operationId) {
  return operationId
    .replace(/[{}]/g, "/")
    .split(/(?:[_\s-/])/g)
    .map((it, idx) => (idx === 0 ? lowerCaseFirst(it) : upperCaseFirst(it)))
    .join("");
}

/**
 * Transform path params, remove leading slash and add trailing slash
 *
 * @param path
 * @returns {string}
 */
function transformRoutePath(path) {
  return `${path
    .split("/")
    .filter((it) => it.length > 0)
    .map((it) => {
      if (it.startsWith("{") && it.endsWith("}")) {
        return `:${it.substring(1, it.length - 1)}`;
      }
      return it;
    })
    .join("/")}/`;
}

/**
 * Extract either path params or query from the provided inputList
 *
 * @param context
 * @param inputList
 * @param compasStruct
 * @param filter
 */
function transformQueryOrParams(context, inputList, compasStruct, filter) {
  const obj = {};

  for (let input of inputList) {
    // resolve param/query references
    if (input.$ref) {
      input = resolveReference(context, input.$ref);
    }

    // ensure filter type align
    if (input.in !== filter) {
      continue;
    }

    obj[input.name] = {
      ...convertSchema(context, input.schema, { queryOrParam: true }),
      isOptional: !input.required,
      docString: input.description || "",
    };
  }

  if (Object.keys(obj).length > 0) {
    return {
      ...ObjectType.getBaseData(),
      type: "object",
      group: compasStruct.group,
      name: compasStruct.name + upperCaseFirst(filter),
      keys: obj,
      validator: {
        strict: false,
      },
    };
  }
}

/**
 * Transform the post body
 *
 * @param context
 * @param contentKey
 * @param input
 * @param compasStruct
 */
function transformBody(context, contentKey, input, compasStruct) {
  if (isNil(input)) {
    return undefined;
  }

  let item;
  if (isNil(input?.content?.[contentKey])) {
    // We don't support whatever requestBody input the spec defines, so accept any type.
    item = new AnyType().build();
  } else {
    item = convertSchema(context, input.content[contentKey].schema);
  }

  item.group = compasStruct.group;
  item.name = `${compasStruct.name}Body`;
  item.docString = input.description || "";

  return item;
}

/**
 * Transform success responses only
 *
 * @param context
 * @param input
 * @param compasStruct
 */
function transformResponse(context, input, compasStruct) {
  const item = convertSchema(
    context,
    input?.content?.["application/json"]?.schema,
  );
  item.group = compasStruct.group;
  item.name = `${compasStruct.name}Response`;
  item.docString = input?.description || "";

  return item;
}

/**
 * Naively try to find the referenced item in the OpenAPI doc
 *
 * @param context
 * @param refString
 */
function resolveReferenceAndConvert(context, refString) {
  const path = refString.split("/").slice(1);
  const name = transformTypeName(path[path.length - 1]);

  let currentItem = context.data;
  while (path.length > 0) {
    currentItem = currentItem?.[path.shift()];
  }

  if (!currentItem) {
    return;
  }

  return {
    ...convertSchema(context, currentItem),
    group: context.defaultGroup,
    name: lowerCaseFirst(name),
  };
}

/**
 * Naively try to find the referenced item in the OpenAPI doc
 *
 * @param context
 * @param refString
 */
function resolveReference(context, refString) {
  const path = refString.split("/").slice(1);

  let currentItem = context.data;
  while (path.length > 0) {
    currentItem = currentItem?.[path.shift()];
  }

  return currentItem;
}

/**
 * Make an effort ot convert to native compas types.
 * Compas and OpenAPI offer flexibility in different places:
 * - allOf, oneOf and anyOf from OpenAPI all result into a compas anyOf
 * - Unknown types result in a compas AnyType
 *
 * @param context
 * @param schema
 * @param {{queryOrParam?: boolean}} [options]
 * @returns {{defaultValue: any, name: any, docString: string, isOptional: boolean, type:
 *   string, group: any}}
 */
function convertSchema(context, schema, options = {}) {
  /** @type {CodeGenType} */
  const result = {
    ...TypeBuilder.getBaseData(),
    type: "any",
  };

  const assignBaseData = () => {
    let data = {};
    switch (result.type) {
      case "any":
        data = AnyType.getBaseData();
        break;
      case "anyOf":
        data = AnyOfType.getBaseData();
        break;
      case "array":
        data = ArrayType.getBaseData();
        break;
      case "boolean":
        data = BooleanType.getBaseData();
        break;
      case "date":
        data = DateType.getBaseData();
        break;
      case "file":
        data = FileType.getBaseData();
        break;
      case "generic":
        data = GenericType.getBaseData();
        break;
      case "number":
        data = NumberType.getBaseData();
        break;
      case "object":
        data = ObjectType.getBaseData();
        break;
      case "reference":
        data = ReferenceType.getBaseData();
        break;
      case "string":
        data = StringType.getBaseData();
        break;
      case "uuid":
        data = UuidType.getBaseData();
        break;
    }
    Object.assign(result, data);
  };

  if (
    !schema ||
    (!schema.type &&
      !schema.$ref &&
      !schema.oneOf &&
      !schema.anyOf &&
      !schema.allOf)
  ) {
    return result;
  }

  if (schema.type === "array") {
    result.type = "array";
    assignBaseData();
    result.values = convertSchema(context, schema.items);

    if (schema.minItems !== undefined) {
      result.validator.min = schema.minItems;
    }
    if (schema.maxItems !== undefined) {
      result.validator.max = schema.maxItems;
    }
  } else if (schema.type === "object") {
    result.type = "object";

    const freeForm = schema.properties === undefined;

    if (freeForm) {
      result.type = "generic";
    }

    assignBaseData();

    if (freeForm) {
      result.keys = convertSchema(context, { type: "string" });
      // get a any-type
      result.values = convertSchema(context, schema.additionalProperties);

      if (!isNil(schema.minProperties) || !isNil(schema.maxProperties)) {
        context.logger.info(
          "object#minProperties and object#maxProperties are not supported",
        );
      }
    } else {
      result.keys = {};

      for (const property of Object.keys(schema.properties || {})) {
        result.keys[property] = convertSchema(
          context,
          schema.properties[property],
        );

        if ((schema.required || []).indexOf(property) === -1) {
          result.keys[property].isOptional = true;
        }
      }
    }
  } else if (schema.type === "boolean") {
    result.type = "boolean";
    assignBaseData();
    if (options.queryOrParam) {
      result.validator.convert = true;
    }
  } else if (schema.type === "string") {
    result.type = "string";
    if (schema.format === "uuid") {
      result.type = "uuid";
      assignBaseData();
    } else if (schema.format === "date" || schema.format === "date-time") {
      result.type = "date";
      assignBaseData();
    } else if (schema.format === "binary") {
      result.type = "file";
      assignBaseData();
    } else {
      assignBaseData();
      if (schema.pattern) {
        const intermediate = RegExp(schema.pattern);
        result.validator.pattern = `/${intermediate.source}/${intermediate.flags}`;
      }
      if (!isNil(schema.minLength)) {
        result.validator.min = schema.minLength;
      }
      if (!isNil(schema.maxLength)) {
        result.validator.max = schema.maxLength;
      }
    }
  } else if (schema.type === "number" || schema.type === "integer") {
    result.type = "number";
    assignBaseData();
    if (options.queryOrParam) {
      result.validator.convert = true;
    }
    result.validator.floatingPoint = schema.type !== "integer";
    if (!isNil(schema.minimum)) {
      result.validator.min = schema.minimum;
    }
    if (!isNil(schema.maximum)) {
      result.validator.max = schema.maximum;
    }
    if (!isNil(schema.exclusiveMinimum) || !isNil(schema.exclusiveMaximum)) {
      context.logger.info(
        "number#exclusiveMinimum and number#exclusiveMaximum are not supported",
      );
    }
  } else if (schema.oneOf || schema.anyOf || schema.allOf) {
    result.type = "anyOf";
    assignBaseData();
    result.values = [];

    if (Array.isArray(schema.oneOf || schema.anyOf || schema.allOf)) {
      for (const val of schema.oneOf || schema.anyOf || schema.allOf) {
        result.values.push(convertSchema(context, val));
      }
    }
  }

  if (
    schema.enum &&
    Array.isArray(schema.enum) &&
    (schema.type === "string" || schema.type === "number")
  ) {
    result.oneOf = [...schema.enum];
  }

  if (!isNil(schema.default)) {
    result.defaultValue = JSON.stringify(schema.default);
  }

  if (!isNil(schema.$ref)) {
    result.type = "reference";
    assignBaseData();

    if (!schema.$ref.startsWith("#/")) {
      context.logger.info(
        `Only local references supported. Found ${schema.$ref}`,
      );
    } else {
      result.reference = {
        group: context.defaultGroup,
        name: lowerCaseFirst(
          transformTypeName(schema.$ref.split("/").slice(-1)[0]),
        ),
      };

      result.reference.uniqueName =
        upperCaseFirst(result.reference.group) +
        upperCaseFirst(result.reference.name);

      // Already going to resolve the reference, so skip it
      if (context.openAPIReferences.indexOf(schema.$ref) === -1) {
        context.openAPIReferences.push(schema.$ref);
      }
    }
  }

  return result;
}

/**
 * @param {string} name
 * @returns {string}
 */
function transformTypeName(name) {
  const parts = name.split(/[-_]/);
  for (let i = 1; i < parts.length; ++i) {
    parts[i] = upperCaseFirst(parts[i]);
  }

  return parts.join("");
}
