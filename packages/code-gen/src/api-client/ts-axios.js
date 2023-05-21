import { fileBlockEnd, fileBlockStart } from "../file/block.js";
import {
  fileContextAddLinePrefix,
  fileContextCreateGeneric,
  fileContextGetOptional,
  fileContextRemoveLinePrefix,
  fileContextSetIndent,
} from "../file/context.js";
import { fileWrite } from "../file/write.js";
import { referenceUtilsGetProperty } from "../processors/reference-utils.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { upperCaseFirst } from "../utils.js";
import { apiClientDistilledTargetInfo } from "./generator.js";

/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
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
}

/**
 * Write the global clients to the common directory
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../generated/common/types.js").StructureRouteDefinition} route
 * @returns {import("../file/context.js").GenerateFile}
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

  importCollector.destructure("../common/api-client", "AppErrorResponse");

  return file;
}

/**
 * Generate the api client function
 *
 * @param {import("../generate.js").GenerateContext} generateContext
 * @param {import("../file/context.js").GenerateFile} file
 * @param {import("../../types/advanced-types").NamedType<import("../generated/common/types").StructureRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function tsAxiosGenerateFunction(
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

  // Allow overwriting any request config
  args.push(`requestConfig?: AxiosRequestConfig`);

  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, ` */`);

  fileBlockStart(
    file,
    `export async function api${upperCaseFirst(route.group)}${upperCaseFirst(
      route.name,
    )}(${args.join(", ")}): Promise<${contextNames.responseTypeName}>`,
  );

  if (route.metadata?.requestBodyType === "form-data") {
    const parameter = "body";

    fileWrite(
      file,
      `const data = ${parameter} instanceof FormData ? ${parameter} : new FormData();`,
    );

    fileBlockStart(file, `if (!(${parameter} instanceof FormData))`);

    /** @type {import("../generated/common/types.d.ts").StructureObjectDefinition} */
    // @ts-expect-error
    const type = structureResolveReference(
      generateContext.structure,

      // @ts-expect-error
      route.body,
    );

    for (const key of Object.keys(type.keys)) {
      const fieldType =
        type.keys[key].type === "reference"
          ? structureResolveReference(generateContext.structure, type.keys[key])
          : type.keys[key];

      const isOptional = referenceUtilsGetProperty(
        generateContext,
        type.keys[key],
        ["isOptional"],
        false,
      );

      if (isOptional) {
        fileBlockStart(file, `if (${parameter}["${key}"] !== undefined)`);
      }

      if (fieldType.type === "file") {
        if (distilledTargetInfo.isReactNative) {
          fileWrite(file, `data.append("${key}", ${parameter}["${key}"]);`);
        } else {
          fileWrite(
            file,
            `data.append("${key}", ${parameter}["${key}"].data, ${parameter}["${key}"].name);`,
          );
        }
      } else {
        fileWrite(file, `data.append("${key}", ${parameter}["${key}"]);`);
      }

      if (isOptional) {
        fileBlockEnd(file);
      }
    }

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

  if (route.metadata?.requestBodyType === "form-data") {
    fileWrite(file, `data,`);

    if (distilledTargetInfo.isReactNative) {
      fileWrite(file, `headers: { "Content-Type": "multipart/form-data" },`);
    }
  }

  if (route.body && route.metadata?.requestBodyType !== "form-data") {
    fileWrite(file, `data: body,`);
  }

  if (
    route.response &&
    structureResolveReference(generateContext.structure, route.response)
      .type === "file"
  ) {
    fileWrite(file, `responseType: "blob",`);
  }

  fileWrite(file, `...requestConfig,`);

  fileContextSetIndent(file, -1);
  fileWrite(file, `});`);

  fileWrite(file, `return response.data;`);

  fileBlockEnd(file);

  fileWrite(file, "\n");
}
