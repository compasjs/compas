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
export function tsFetchGenerateCommonFile(generateContext) {
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

  fileWrite(
    file,
    `export type FetchFn = (input: URL|string, init?: RequestInit) => Promise<Response>;`,
  );

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    fileWrite(
      file,
      `export let fetchFn: FetchFn = fetch;

/**
 * Override the global fetch function. This can be used to apply defaults to each call.
 */
export function setFetchFn(newFetchFn: FetchFn) {
  fetchFn = newFetchFn;
}
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

  fileWrite(
    file,
    `
export class AppErrorResponse extends Error {
  public originalError: Error|undefined;
  public request: {
    input: URL|string;
    init?: RequestInit;
  };
  public response: Response|undefined;
  public body?: unknown;
  
  constructor(originalError: Error|undefined, input: URL|string, init: RequestInit|undefined, response: Response|undefined, body?: unknown) {
    super('Request failed.');
    
    this.name = "AppErrorResponse";
    this.originalError = originalError;
    this.request = { input, init };
    this.response = response;
    this.body = body;
  }
}
`,
  );

  fileWrite(
    file,
    `
/**
 * Wrap the provided fetch function, adding the baseUrl to each invocation.
 */
export function fetchWithBaseUrl(originalFetch: FetchFn, baseUrl: string): FetchFn {
  return function fetchWithBaseUrl(input: URL|string, init?: RequestInit) {
    return originalFetch(new URL(input, baseUrl), init);
  };
}
    
/**
 * Wrap the provided fetch function, to catch errors and convert where possible to an AppError
 */
export function fetchCatchErrorAndWrapWithAppError(originalFetch: FetchFn): FetchFn {
  return async function fetchCatchErrorAndWrapWithAppError(input: URL|string, init?: RequestInit) {
    const response = await originalFetch(input, init);
  
    try {
      
      if (!response.ok) {
        const body = await response.json();
        
        throw new AppErrorResponse(undefined, input, init, response, body);
      }
     
      return response;
    } catch (error: any) {
      if (error instanceof AppErrorResponse) {
        throw error;
      }
      
      throw new AppErrorResponse(error, input, init, response);
    }
  };
}
`,
  );
}

/**
 * Get a specific api client file.
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function tsFetchGetApiClientFile(generateContext, route) {
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

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    importCollector.destructure(`../common/api-client`, "fetchFn");
  } else {
    importCollector.destructure(`../common/api-client`, "FetchFn");
  }

  importCollector.destructure("../common/api-client", "AppErrorResponse");

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
export function tsFetchGenerateFunction(
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
    args.push("fetchFn: FetchFn");
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
  args.push(`requestConfig?: RequestInit`);

  fileContextRemoveLinePrefix(file, 3);
  fileWrite(file, ` */`);

  fileBlockStart(
    file,
    `export async function api${upperCaseFirst(route.group)}${upperCaseFirst(
      route.name,
    )}(${args.join(", ")}): Promise<${
      contextNames.responseTypeName ?? "Response"
    }>`,
  );

  if (route.files || route.metadata?.requestBodyType === "form-data") {
    const parameter = route.body ? "body" : "files";

    fileWrite(
      file,
      `const data = ${parameter} instanceof FormData ? ${parameter} : new FormData();`,
    );

    fileBlockStart(file, `if (!(${parameter} instanceof FormData))`);

    /** @type {import("../generated/common/types.js").ExperimentalObjectDefinition} */
    // @ts-expect-error
    const type = structureResolveReference(
      generateContext.structure,

      // @ts-expect-error
      route.body ?? route.files,
    );

    for (const key of Object.keys(type.keys)) {
      const fieldType =
        type.keys[key].type === "reference"
          ? structureResolveReference(generateContext.structure, type.keys[key])
          : type.keys[key];

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
    }

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
        .join("/")}?$\{new URLSearchParams(query as any).toString()}\`,`,
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

    if (distilledTargetInfo.isReactNative) {
      fileWrite(file, `headers: { "Content-Type": "multipart/form-data" },`);
    }
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

  if (route.response) {
    if (
      structureResolveReference(generateContext.structure, route.response)
        .type === "file"
    ) {
      fileWrite(file, `return response.blob();`);
    } else {
      fileWrite(file, `return response.json();`);
    }
  } else {
    fileWrite(file, `return response;`);
  }

  fileBlockEnd(file);

  fileWrite(file, "\n");
}
