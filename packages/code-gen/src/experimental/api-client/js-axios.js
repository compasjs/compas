import { AppError, isNil } from "@compas/stdlib";
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

    if (
      generateContext.options.generators.apiClient?.target.includeWrapper ===
      "react-query"
    ) {
      importCollector.destructure("@tanstack/react-query", "QueryClient");

      fileWrite(
        file,
        `/**
 * @type {import("@tanstack/react-query").QueryClient}
 */
export const queryClient = new QueryClient();
`,
      );
    }
  }

  if (
    generateContext.options.generators.apiClient?.target?.targetRuntime ===
    "node.js"
  ) {
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
  } else {
    fileWrite(
      file,
      `\nexport class ResponseError extends Error {
  constructor(group, name, error) {
    super(\`Response validation failed for (group: "$\{group}", name: "$\{name}").\`);

    this.group = group;
    this.name = name;
    this.error = error;
    
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
  
  toJSON() {
    return {
      name: "ResponseError",
      route: {
        group: this.group,
        name: this.name,
      },
      error: this.error,
    };
  }
}
`,
    );
  }
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

    if (
      generateContext.options.generators.apiClient.target.includeWrapper ===
      "react-query"
    ) {
      importCollector.destructure(`../common/api-client.js`, "queryClient");
    }
  }

  if (
    generateContext.options.generators.apiClient?.target.targetRuntime ===
    "node.js"
  ) {
    importCollector.destructure("@compas/stdlib", "AppError");
  } else {
    importCollector.destructure("../common/api-client.js", "ResponseError");
  }

  return file;
}

/**
 * Generate the api client function
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalGenerateOptions["generators"]["apiClient"]} options
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function jsAxiosGenerateFunction(
  generateContext,
  file,
  options,
  route,
  contextNames,
) {
  if (isNil(options)) {
    throw AppError.serverError({
      message: "Received unknown apiClient generator options",
    });
  }

  const args = [];
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " * ");
  if (route.docString) {
    fileWrite(file, `${route.docString}\n`);
  }
  fileWrite(file, `Tags: ${JSON.stringify(route.tags)}\n`);

  if (!options.target.globalClient) {
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
    fileWrite(file, `@param {${contextNames.bodyTypeName}} body`);
  }
  if (route.files) {
    args.push("files");
    fileWrite(file, `@param {${contextNames.filesTypeName}} files`);
  }

  // Allow overwriting any request config
  args.push("requestConfig");
  fileWrite(
    file,
    `@param {import("axios").AxiosRequestConfig} [requestConfig]`,
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

    if (options.target.targetRuntime === "react-native") {
      fileWrite(file, `data.append(key, file);`);
    } else {
      fileWrite(file, `data.append(key, file.data, file.name);`);
    }

    fileContextSetIndent(file, -2);
    fileWrite(file, `}\n}`);
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

  if (route.files) {
    fileWrite(file, `data,`);
  }

  if (route.body) {
    // TODO: handle form-data calls mostly for OpenAPI imports.
    fileWrite(file, `data: body,`);
  }

  if (options.target.targetRuntime === "react-native") {
    fileWrite(file, `headers: { "Content-Type": "multipart/form-data" },`);
  } else if (options.target.targetRuntime === "node.js" && route.files) {
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
    if (options.target.targetRuntime === "node.js") {
      fileWrite(file, `responseType: "stream",`);
    } else {
      fileWrite(file, `responseType: "blob",`);
    }
  }

  fileWrite(file, `...requestConfig,`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `});`);

  if (route.response) {
    fileWrite(
      file,
      `const { value, error } = ${contextNames.responseValidator}(response.data);`,
    );
    fileBlockStart(file, `if (error)`);

    if (options.target.targetRuntime === "node.js") {
      fileWrite(
        file,
        `throw AppError.validationError("validator.error", {
  route: { group: "${route.group}", name: "${route.name}", },
  error,
});`,
      );
    } else {
      fileWrite(
        file,
        `throw new ResponseError("${route.group}","${route.name}", error);`,
      );
    }
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
