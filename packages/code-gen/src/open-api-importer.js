import { log } from "@lbu/insight";
import { isNil } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "./types/index.js";
import { lowerCaseFirst, upperCaseFirst } from "./utils.js";

/**
 * Try some 'free'-form conversion
 * A lot of things are not mappable between the structures, and some have a different
 * meaning between OpenAPI and LBU.
 * We convert the routes first, using the first tag where possible, else the default
 * group. We then try to resolve the path-params and query params. Followed by the
 * request body and 200-response. There are some extra generated references to make sure
 * all path's are also referenced into the default group as to make sure they will be
 * included in the generation.
 *
 * @param {string} defaultGroup
 * @param {object} data
 */
export function convertOpenAPISpec(defaultGroup, data) {
  if (!data?.openapi?.startsWith("3.")) {
    throw new Error("Only openapi spec version 3 is (partially) supported");
  }

  const result = {
    [lowerCaseFirst(defaultGroup)]: {},
  };

  /**
   * crossReferences are used to link routes to the default group
   *
   * openAPIReferences to resolve $ref's in the document
   */
  const context = {
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
      ...TypeCreator.types.get("reference").class.getBaseData(),
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
    const refValue = resolveReference(context, ref);
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
  const lbuStruct = {
    ...TypeBuilder.getBaseData(),
    type: "route",
    group: lowerCaseFirst(item.tags?.[0] ?? context.defaultGroup),
    name: transformRouteName(context, item.operationId),
    docString: item.description ?? "",
    method: method.toUpperCase(),
    path: transformRoutePath(context, path),
    tags: [],
  };

  if (context.defaultGroup !== lbuStruct.group) {
    context.crossReferences.push({
      name: lbuStruct.name,
      group: lbuStruct.group,
    });
  }

  // OpenAPI has the path & query params in a single list
  lbuStruct.query = transformQueryOrParams(
    context,
    item.parameters || [],
    lbuStruct,
    "query",
  );
  lbuStruct.params = transformQueryOrParams(
    context,
    item.parameters || [],
    lbuStruct,
    "path",
  );

  lbuStruct.body = transformBody(context, item.requestBody, lbuStruct);
  lbuStruct.response = transformResponse(
    context,
    item.responses?.["200"],
    lbuStruct,
  );

  context.result[lbuStruct.group] = context.result[lbuStruct.group] || {};
  context.result[lbuStruct.group][lbuStruct.name] = lbuStruct;
}

/**
 * Remove spaces, dashes and return camelCased name
 *
 * @param context
 * @param operationId
 * @returns {string}
 */
function transformRouteName(context, operationId) {
  return operationId
    .split(/(?:[_\s-])/g)
    .map((it, idx) => (idx === 0 ? lowerCaseFirst(it) : upperCaseFirst(it)))
    .join("");
}

/**
 * Transform path params, remove leading slash and add trailing slash
 *
 * @param context
 * @param path
 * @returns {string}
 */
function transformRoutePath(context, path) {
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
 * @param lbuStruct
 * @param filter
 */
function transformQueryOrParams(context, inputList, lbuStruct, filter) {
  const obj = {};

  for (const input of inputList) {
    if (input.in !== filter) {
      continue;
    }

    obj[input.name] = {
      isOptional: !input.required,
      docString: input.description || "",
      ...convertSchema(context, input.schema),
    };
  }

  if (Object.keys(obj).length > 0) {
    return {
      ...TypeCreator.types.get("object").class.getBaseData(),
      type: "object",
      group: lbuStruct.group,
      name: lbuStruct.name + upperCaseFirst(filter),
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
 * @param input
 * @param lbuStruct
 */
function transformBody(context, input, lbuStruct) {
  if (isNil(input?.content?.["application/json"]?.schema)) {
    return undefined;
  }

  const item = convertSchema(context, input.content["application/json"].schema);
  item.group = lbuStruct.group;
  item.name = `${lbuStruct.name}Body`;
  item.docString = input.description || "";
  item.isOptional = !input.required;

  return item;
}

/**
 * Transform success responses only
 *
 * @param context
 * @param input
 * @param lbuStruct
 */
function transformResponse(context, input, lbuStruct) {
  if (isNil(input?.content?.["application/json"]?.schema)) {
    return undefined;
  }

  const item = convertSchema(context, input.content["application/json"].schema);
  item.group = lbuStruct.group;
  item.name = `${lbuStruct.name}Response`;
  item.docString = input.description || "";

  return item;
}

/**
 * Naively try to find the referenced item in the OpenAPI doc
 *
 * @param context
 * @param refString
 */
function resolveReference(context, refString) {
  const path = refString.split("/").slice(1);
  const name = path[path.length - 1];

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
 * Make an effort ot convert to native lbu types.
 * LBU and OpenAPI offer flexibility in different places:
 * - allOf, oneOf and anyOf from OpenAPI all result into a LBU anyOf
 * - Unknown types result in a lbu AnyType
 *
 * @param context
 * @param schema
 * @returns {{defaultValue: any, name: any, docString: string, isOptional: boolean, type:
 *   string, group: any}}
 */
function convertSchema(context, schema) {
  const result = {
    ...TypeBuilder.getBaseData(),
    type: "any",
  };

  const assignBaseData = () => {
    Object.assign(
      result,
      TypeCreator.types.get(result.type)?.class.getBaseData(),
    );
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
        log.info(
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
  } else if (schema.type === "string") {
    result.type = "string";
    if (result.format === "uuid") {
      result.type = "uuid";
      assignBaseData();
    } else if (result.format === "date" || result.format === "date-time") {
      result.type = "date";
      assignBaseData();
    } else {
      assignBaseData();
      if (schema.pattern) {
        result.validator.pattern = schema.pattern;
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
    result.validator.floatingPoint = schema.type !== "integer";
    if (!isNil(schema.minimum)) {
      result.validator.min = schema.minimum;
    }
    if (!isNil(schema.maximum)) {
      result.validator.max = schema.maximum;
    }
    if (!isNil(schema.exclusiveMinimum) || !isNil(schema.exclusiveMaximum)) {
      log.info(
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

  if (!isNil(schema.$ref)) {
    result.type = "reference";
    assignBaseData();

    if (!schema.$ref.startsWith("#/")) {
      log.info(`Only local references supported. Found ${schema.$ref}`);
    } else {
      result.reference = {
        group: context.defaultGroup,
        name: lowerCaseFirst(schema.$ref.split("/").slice(-1)[0]),
      };

      result.reference.uniqueName =
        upperCaseFirst(result.reference.group) +
        upperCaseFirst(result.reference.name);

      context.openAPIReferences.push(schema.$ref);
    }
  }

  return result;
}
