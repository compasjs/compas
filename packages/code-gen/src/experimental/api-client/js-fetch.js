import { upperCaseFirst } from "../../utils.js";
import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileWrite } from "../file/write.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { apiClientDistilledTargetInfo } from "./generator.js";

/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 */
export function jsFetchGenerateCommonFile(generateContext) {
  const file = fileContextCreateGeneric(
    generateContext,
    "common/api-client.js",
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  fileWrite(
    file,
    `/**
 * @typedef {(input: string|URL, init?: RequestInit) => Promise<Response>} FetchFn
 */
`,
  );

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    fileWrite(
      file,
      `/**
 * @type {FetchFn}
 */
export let fetchFn = fetch;

/**
 * Override the global fetch function. This can be used to apply defaults to each call.
 *
 * @param {FetchFn} newFetchFn
 */
export function setFetchFn(newFetchFn) {
  fetchFn = newFetchFn;
}
`,
    );
  }

  importCollector.destructure("@compas/stdlib", "AppError");

  fileWrite(
    file,
    `
/**
 * Wrap the provided fetch function, adding the baseUrl to each invocation.
 *
 * @param {FetchFn} originalFetch
 * @param {string} baseUrl
 * @returns {FetchFn}
 */
export function fetchWithBaseUrl(originalFetch, baseUrl) {
  return function fetchWithBaseUrl(input, init) {
    return originalFetch(new URL(input, baseUrl), init);
  };
}
    
/**
 * Wrap the provided fetch function, to catch errors and convert where possible to an AppError
 *
 * @param {FetchFn} originalFetch
 * @returns {FetchFn}
 */
export function fetchCatchErrorAndWrapWithAppError(originalFetch) {
  return async function fetchCatchErrorAndWrapWithAppError(input, init) {
    try {
      const response = await originalFetch(input, init);
      
      if (!response.ok) {
        const body = await response.json();
        
        if (typeof body.key === "string" && !!body.info && typeof body.info === "object") {
          throw new AppError(
            body.key,
            response.status,
            body.cause ? { info: body.info, cause: body.cause } : body.info,
          );
        } else {
          throw new AppError("response.error", response.status, {
            fetch: {
              request: { input, init },
              response: {
                status: response.status,
                body,
              },
            },
          });
        }
      }
     
      return response;
    } catch (error) {
      if (AppError.instanceOf(error)) {
        throw error;
      }
      
      // Unknown error, wrap with a hard '500' since this is most likely unexecpted.
      throw new AppError("response.error", 500, AppError.format(error));
    }
  };
}
`,
  );
}

/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function jsFetchGetApiClientFile(generateContext, route) {
  let file = fileContextGetOptional(
    generateContext,
    `${route.group}/apiClient.js`,
  );

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(
    generateContext,
    `${route.group}/apiClient.js`,
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    importCollector.destructure(`../common/api-client.js`, "fetchFn");
  }

  importCollector.destructure("@compas/stdlib", "AppError");

  return file;
}

/**
 * Generate the api client function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function jsFetchGenerateFunction(
  generateContext,
  file,
  route,
  contextNames,
) {
  const distilledTargetInfo = apiClientDistilledTargetInfo(generateContext);

  const args = [];
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " * ");
  if (route.docString) {
    fileWrite(file, `${route.docString}\n`);
  }
  fileWrite(file, `Tags: ${JSON.stringify(route.tags)}\n`);

  if (!distilledTargetInfo.useGlobalClients) {
    args.push("fetchFn");
    fileWrite(file, `@param {FetchFn} fetchFn`);
  }

  if (route.params) {
    args.push("params");
    fileWrite(file, `@param {${contextNames.paramsTypeName}} params`);
  }
  if (route.query) {
    args.push("query");
    fileWrite(file, `@param {${contextNames.queryTypeName}} query`);
  }
  if (route.body) {
    args.push("body");
    fileWrite(
      file,
      `@param {${contextNames.bodyTypeName}${
        route.metadata?.requestBodyType === "form-data" ? "|FormData" : ""
      }} body`,
    );
  }
  if (route.files) {
    args.push("files");
    fileWrite(file, `@param {${contextNames.filesTypeName}} files`);
  }

  // Allow overwriting any request config
  args.push("requestConfig");
  fileWrite(
    file,
    `@param {RequestInit${
      route.response ? ` & { skipResponseValidation?: boolean }` : ""
    }} [requestConfig]`,
  );

  if (route.response) {
    fileWrite(file, `@returns {Promise<${contextNames.responseTypeName}>}`);
  } else {
    fileWrite(file, `@returns {Promise<Response>}`);
  }

  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, ` */`);

  fileBlockStart(
    file,
    `export async function api${upperCaseFirst(route.group)}${upperCaseFirst(
      route.name,
    )}(${args.join(", ")})`,
  );

  if (route.files) {
    fileWrite(
      file,
      `
const data = new FormData();

for (const key of Object.keys(files)) {
  const keyFiles = Array.isArray(files[key]) ? files[key] : [files[key]];
  
  for (const file of keyFiles) {`,
    );
    fileContextSetIndent(file, 2);

    fileWrite(file, `data.append(key, file.data, file.name);`);

    fileContextSetIndent(file, -2);
    fileWrite(file, `}\n}`);
  }

  if (route.metadata?.requestBodyType === "form-data") {
    fileWrite(
      file,
      `const data = body instanceof FormData ? body : new FormData();`,
    );
    fileBlockStart(file, `if (!(body instanceof FormData))`);
    fileWrite(
      file,
      `for (const key of Object.keys(body)) { data.append(key, body[key]); }`,
    );
    fileBlockEnd(file);
  }

  fileWrite(file, `const response = await fetchFn(`);
  fileContextSetIndent(file, 1);

  if (route.query) {
    fileWrite(
      file,
      `\`${route.path
        .split("/")
        .map((it) => (it.startsWith(":") ? `$\{params.${it.slice(1)}}` : it))
        .join("/")}?$\{new URLSearchParams(query).toString()}\`,`,
    );
  } else {
    fileWrite(
      file,
      `\`${route.path
        .split("/")
        .map((it) => (it.startsWith(":") ? `$\{params.${it.slice(1)}}` : it))
        .join("/")}\`,`,
    );
  }

  fileWrite(file, `{`);
  fileContextSetIndent(file, 1);

  fileWrite(file, `method: "${route.method}",`);

  if (route.files || route.metadata?.requestBodyType === "form-data") {
    fileWrite(file, `body: data,`);
  }

  if (route.body && route.metadata?.requestBodyType !== "form-data") {
    fileWrite(file, `body: JSON.stringify(body),`);
    fileWrite(file, `headers: { "Content-Type": "application/json", },`);
  }

  fileWrite(file, `...requestConfig,`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `}`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `);`);

  if (
    route.response &&
    structureResolveReference(generateContext.structure, route.response)
      .type === "file"
  ) {
    fileWrite(file, `const result = await response.blob();`);
  } else {
    fileWrite(file, `const result = await response.json();`);
  }

  if (route.response) {
    fileBlockStart(file, `if (requestConfig?.skipResponseValidation)`);
    fileWrite(file, `return result;`);
    fileBlockEnd(file);

    fileWrite(
      file,
      `const { value, error } = ${contextNames.responseValidator}(result);`,
    );
    fileBlockStart(file, `if (error)`);

    fileWrite(
      file,
      `throw AppError.validationError("validator.error", {
  route: { group: "${route.group}", name: "${route.name}", },
  error,
});`,
    );

    fileBlockEnd(file);

    fileBlockStart(file, `else`);
    fileWrite(file, `return value;`);
    fileBlockEnd(file);
  } else {
    fileWrite(file, `return response;`);
  }

  fileBlockEnd(file);

  fileWrite(file, "\n");
}
