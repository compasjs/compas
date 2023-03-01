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
export function tsAxiosGenerateCommonFile(generateContext) {
  const includeWrapper =
    generateContext.options.generators.apiClient?.target.includeWrapper ===
    "react-query";

  const file = fileContextCreateGeneric(
    generateContext,
    `common/api-client.ts${includeWrapper ? "x" : ""}`,
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    importCollector.raw(`import axios from "axios"`);
    importCollector.destructure("axios", "AxiosInstance");

    fileWrite(
      file,
      `export const axiosInstance: AxiosInstance = axios.create();
`,
    );

    if (includeWrapper) {
      importCollector.destructure("@tanstack/react-query", "QueryClient");

      fileWrite(
        file,
        `export const queryClient = new QueryClient();
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
    importCollector.destructure("axios", "AxiosInstance");

    fileWrite(
      file,
      `/**
 * Adds an interceptor to the provided Axios instance, wrapping any error in an AppError.
 * This allows directly testing against an error key or property.
 */
export function axiosInterceptErrorAndWrapWithAppError(axiosInstance: AxiosInstance) {
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
    importCollector.destructure("axios", "AxiosError");

    fileWrite(
      file,
      `\nexport type AppErrorResponse = AxiosError<{
  key?: string;
  status?: number;
  requestId?: number;
  info?: {
    [key: string]: unknown;
  };
}>;
`,
    );

    if (
      includeWrapper &&
      !generateContext.options.generators.apiClient?.target.globalClient
    ) {
      importCollector.destructure("axios", "AxiosError");
      importCollector.destructure("axios", "AxiosInstance");
      importCollector.raw(`import React from "react";`);
      importCollector.destructure("react", "createContext");
      importCollector.destructure("react", "PropsWithChildren");
      importCollector.destructure("react", "useContext");
      fileWrite(
        file,
        `const ApiContext = createContext<AxiosInstance | undefined>(undefined);

export function ApiProvider({
  instance, children,
}: PropsWithChildren<{
  instance: AxiosInstance;
}>) {
  return <ApiContext.Provider value={instance}>{children}</ApiContext.Provider>;
}

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw Error("Be sure to wrap your application with <ApiProvider>.");
  }

  return context;
};`,
      );
    }
  }
}

/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function tsAxiosGetApiClientFile(generateContext, route) {
  let file = fileContextGetOptional(
    generateContext,
    `${route.group}/apiClient.ts`,
  );

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(
    generateContext,
    `${route.group}/apiClient.ts`,
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("axios", "AxiosRequestConfig");

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    importCollector.destructure(`../common/api-client`, "axiosInstance");
  } else {
    importCollector.destructure("axios", "AxiosInstance");
  }

  if (
    generateContext.options.generators.apiClient?.target.targetRuntime ===
    "node.js"
  ) {
    importCollector.raw(`import FormData from "form-data";`);
    importCollector.destructure("@compas/stdlib", "AppError");
  } else {
    importCollector.destructure("../common/api-client", "AppErrorResponse");
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
export function tsAxiosGenerateFunction(
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

  const skipResponseValidation =
    options.target.targetRuntime === "browser" ||
    options.target.targetRuntime === "react-native";

  const args = [];
  fileWrite(file, `/**`);
  fileContextAddLinePrefix(file, " * ");
  if (route.docString) {
    fileWrite(file, `${route.docString}\n`);
  }
  fileWrite(file, `Tags: ${JSON.stringify(route.tags)}\n`);

  if (!options.target.globalClient) {
    args.push("axiosInstance: AxiosInstance");
  }

  if (route.params) {
    args.push(`params: ${contextNames.paramsTypeName}`);
  }
  if (route.query) {
    args.push(`query: ${contextNames.queryTypeName}`);
  }
  if (route.body) {
    args.push(
      `body: ${contextNames.bodyTypeName}${
        route.metadata?.requestBodyType === "form-data" ? "|FormData" : ""
      }`,
    );
  }
  if (route.files) {
    args.push(`files: ${contextNames.filesTypeName}`);
  }

  // Allow overwriting any request config
  args.push(
    `requestConfig?: AxiosRequestConfig${
      route.response && !skipResponseValidation
        ? ` & { skipResponseValidation?: boolean }`
        : ""
    }`,
  );

  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, ` */`);

  fileBlockStart(
    file,
    `export async function api${upperCaseFirst(route.group)}${upperCaseFirst(
      route.name,
    )}(${args.join(", ")}): Promise<${contextNames.responseTypeName}>`,
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

  if (route.response && !skipResponseValidation) {
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
