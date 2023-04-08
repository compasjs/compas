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
export function jsAxiosGenerateCommonFile(generateContext) {
  const file = fileContextCreateGeneric(
    generateContext,
    "common/api-client.js",
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    importCollector.destructure("axios", "axios");

    fileWrite(
      file,
      `/**
 * @type {import("axios").AxiosInstance}
 */
export const axiosInstance = axios.create();
`,
    );
  }

  importCollector.destructure("@compas/stdlib", "AppError");
  importCollector.destructure("@compas/stdlib", "streamToBuffer");

  fileWrite(
    file,
    `/**
 * Adds an interceptor to the provided Axios instance, wrapping any error in an AppError.
 * This allows directly testing against an error key or property.
 *
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosInterceptErrorAndWrapWithAppError(axiosInstance) {
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    // Validator error
    if (AppError.instanceOf(error)) {
      // If it is an AppError already, it most likely is thrown by the response
      // validators. So we rethrow it as is.
      throw error;
    }

    if (typeof error?.response?.data?.pipe === "function") {
      const buffer = await streamToBuffer(error.response.data);
      try {
        error.response.data = JSON.parse(buffer.toString("utf-8"));
      } catch {
        // Unknown error
        throw new AppError(
          \`response.error\`,
          error.response?.status ?? 500,
          {
            message:
              "Could not decode the response body for further information.",
          },
          error,
        );
      }
    }

    // Server AppError
    const { key, info } = error.response?.data ?? {};
    if (typeof key === "string" && !!info && typeof info === "object") {
      throw new AppError(key, error.response.status, info, error);
    }

    // Unknown error
    throw new AppError(
      \`response.error\`,
      error.response?.status ?? 500,
      AppError.format(error),
    );
  });
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
export function jsAxiosGetApiClientFile(generateContext, route) {
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
    importCollector.destructure(`../common/api-client.js`, "axiosInstance");
  }

  importCollector.raw(`import FormData from "form-data";`);
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
export function jsAxiosGenerateFunction(
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
    args.push("axiosInstance");
    fileWrite(file, `@param {import("axios").AxiosInstance} axiosInstance`);
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
    `@param {import("axios").AxiosRequestConfig${
      route.response ? ` & { skipResponseValidation?: boolean }` : ""
    }} [requestConfig]`,
  );

  if (route.response) {
    fileWrite(file, `@returns {Promise<${contextNames.responseTypeName}>}`);
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

  fileWrite(file, `const response = await axiosInstance.request({`);
  fileContextSetIndent(file, 1);

  // Format axios arguments
  fileWrite(
    file,
    `url: \`${route.path
      .split("/")
      .map((it) => (it.startsWith(":") ? `$\{params.${it.slice(1)}}` : it))
      .join("/")}\`,`,
  );
  fileWrite(file, `method: "${route.method}",`);

  if (route.query) {
    fileWrite(file, `params: query,`);
  }

  if (route.files || route.metadata?.requestBodyType === "form-data") {
    fileWrite(file, `data,`);
  }

  if (route.body && route.metadata?.requestBodyType !== "form-data") {
    fileWrite(file, `data: body,`);
  }

  if (route.files) {
    fileWrite(
      file,
      `headers: typeof data.getHeaders === "function" ? data.getHeaders() : {},`,
    );
  }

  if (
    route.response &&
    structureResolveReference(generateContext.structure, route.response)
      .type === "file"
  ) {
    fileWrite(file, `responseType: "stream",`);
  }

  fileWrite(file, `...requestConfig,`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `});`);

  if (route.response) {
    fileBlockStart(file, `if (requestConfig?.skipResponseValidation)`);
    fileWrite(file, `return response.data;`);
    fileBlockEnd(file);

    fileWrite(
      file,
      `const { value, error } = ${contextNames.responseValidator}(response.data);`,
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
    fileWrite(file, `return response.data;`);
  }

  fileBlockEnd(file);

  fileWrite(file, "\n");
}
