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
import { fileWrite, fileWriteInline } from "../file/write.js";
import { structureResolveReference } from "../processors/structure.js";
import { JavascriptImportCollector } from "../target/javascript.js";
import { typesOptionalityIsOptional } from "../types/optionality.js";

/**
 * Get the api client file
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function axiosReactQueryGetApiClientFile(generateContext, route) {
  let file = fileContextGetOptional(
    generateContext,
    `${route.group}/reactQueries.tsx`,
  );

  if (file) {
    return file;
  }

  file = fileContextCreateGeneric(
    generateContext,
    `${route.group}/reactQueries.tsx`,
    {
      importCollector: new JavascriptImportCollector(),
    },
  );

  const importCollector = JavascriptImportCollector.getImportCollector(file);

  if (generateContext.options.generators.apiClient?.target.globalClient) {
    // Import the global clients, this has affect on a bunch of the generated api's where we don't have to accept these arguments
    importCollector.destructure(`../common/api-client`, "axiosInstance");
    importCollector.destructure("../common/api-client", "queryClient");
  } else {
    // Import ways to infer or accept the clients
    importCollector.destructure("../common/api-client", "useApi");
    importCollector.destructure("@tanstack/react-query", "useQueryClient");
    importCollector.destructure("axios", "AxiosInstance");
  }

  // Error handling
  importCollector.destructure("../common/api-client", "ResponseError");
  importCollector.destructure("axios", "AxiosError");

  importCollector.destructure("axios", "AxiosRequestConfig");

  // @tanstack/react-query imports
  importCollector.destructure("@tanstack/react-query", "QueryKey");
  importCollector.destructure("@tanstack/react-query", "UseMutationOptions");
  importCollector.destructure("@tanstack/react-query", "UseMutationResult");
  importCollector.destructure("@tanstack/react-query", "UseQueryOptions");
  importCollector.destructure("@tanstack/react-query", "UseQueryResult");
  importCollector.destructure("@tanstack/react-query", "useMutation");
  importCollector.destructure("@tanstack/react-query", "useQuery");

  return file;
}

/**
 * Generate the api client hooks
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../generated/common/types").ExperimentalGenerateOptions["generators"]["apiClient"]} options
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function axiosReactQueryGenerateFunction(
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

  const hookName = `use${upperCaseFirst(route.group)}${upperCaseFirst(
    route.name,
  )}`;
  const apiName = `api${upperCaseFirst(route.group)}${upperCaseFirst(
    route.name,
  )}`;

  // Import the corresponding api client function.
  const importCollector = JavascriptImportCollector.getImportCollector(file);
  importCollector.destructure("./apiClient", `${apiName}`);

  // Write the doc block
  if (route.docString || route.tags.length > 0) {
    fileWrite(file, `/**`);
    fileContextAddLinePrefix(file, " * ");
    if (route.docString) {
      fileWrite(file, `${route.docString}\n`);
    }

    if (route.tags.length) {
      fileWrite(file, `Tags: ${JSON.stringify(route.tags)}\n`);
    }

    fileContextRemoveLinePrefix(file, 3);
    fileWrite(file, ` */`);
  }

  // Helper variables for reusable patterns
  const argumentList = ({ suffix, withRequestConfig }) =>
    [
      route.params ? `params: ${contextNames.paramsTypeName}` : undefined,
      route.query ? `query: ${contextNames.queryTypeName}` : undefined,
      route.body ? `body: ${contextNames.bodyTypeName}` : undefined,
      route.files ? `files: ${contextNames.filesTypeName}` : undefined,
      withRequestConfig
        ? `requestConfig?: AxiosRequestConfig${
            route.response ? ` & { skipResponseValidation?: boolean }` : ""
          }`
        : undefined,
    ]
      .filter((it) => !!it)
      .map((it) => `${it}${suffix}`);
  const parameterList = ({ prefix, withRequestConfig }) => {
    return [
      route.params ? `params,` : undefined,
      route.query ? `query,` : undefined,
      route.body ? `body,` : undefined,
      route.files ? `files,` : undefined,
      withRequestConfig ? `requestConfig,` : undefined,
    ]
      .filter((it) => !!it)
      .map((it) => `${prefix}${it}`)
      .join("");
  };

  const hasGlobalClient = options.target.globalClient;
  const axiosInstanceArgument = hasGlobalClient
    ? ""
    : `axiosInstance: AxiosInstance,`;
  const axiosInstanceParameter = hasGlobalClient ? "" : "axiosInstance,";
  const queryClientArgument = hasGlobalClient
    ? ""
    : `queryClient: QueryClient,`;

  if (route.method === "GET" || route.idempotent) {
    fileWriteInline(
      file,
      `export async function ${hookName}<TData = ${contextNames.responseTypeName}>(`,
    );

    // When no arguments are required, the whole opts object is optional
    if (route.params || route.query || route.body) {
      fileWrite(file, `opts: {`);
    } else {
      fileWrite(file, `opts?: {`);
    }

    fileContextSetIndent(file, 1);
    fileWrite(
      file,
      argumentList({ suffix: ";", withRequestConfig: true }).join("\n"),
    );
    fileWrite(
      file,
      `options?: UseQueryOptions<${contextNames.responseTypeName}, ResponseError|AxiosError, TData>`,
    );
    fileContextSetIndent(file, -1);

    // When no arguments are required, the whole opts object is optional
    if (route.params || route.query || route.body) {
      fileBlockStart(file, `})`);
    } else {
      fileBlockStart(file, `}|undefined)`);
    }

    if (!hasGlobalClient) {
      // Get the api client from the React context
      fileWrite(file, `const axiosInstance = useApi();`);
    }

    fileWrite(file, `const options = opts?.options ?? {};`);
    axiosReactQueryWriteIsEnabled(generateContext, file, route);

    fileWriteInline(file, `return useQuery(${hookName}.queryKey(`);
    fileWriteInline(
      file,
      parameterList({ prefix: "opts.", withRequestConfig: false }),
    );
    fileWriteInline(
      file,
      `), ({ signal }) => {
  opts.requestConfig ??= {};
  opts.requestConfig.signal = signal;
    
  return ${apiName}(${axiosInstanceParameter}
  ${parameterList({
    prefix: "opts.",
    withRequestConfig: true,
  })}
  );
  }, options);`,
    );

    fileBlockEnd(file);

    fileWrite(
      file,
      `/**
 * Base key used by ${hookName}.queryKey()
 */
${hookName}.baseKey = (): QueryKey => ["${route.group}", "${route.name}"];

/**
 * Query key used by ${hookName}
 */
${hookName}.queryKey = (
  ${argumentList({ suffix: ",", withRequestConfig: false }).join("")}
): QueryKey => [
  ...${hookName}.baseKey(),
  ${parameterList({ prefix: "", withRequestConfig: false })}
];

/**
 * Fetch ${hookName} via the queryClient and return the result
 */
 ${hookName}.fetch = (
  ${queryClientArgument}
  ${axiosInstanceArgument}
  ${
    route.params || route.query || route.body
      ? `data: { ${argumentList({ suffix: ";", withRequestConfig: true }).join(
          "\n",
        )} }`
      : ""
  }
 ) => {
  return queryClient.fetchQuery(${hookName}.queryKey(
  ${parameterList({ prefix: "data.", withRequestConfig: false })}
  ), () => ${apiName}(
   ${axiosInstanceParameter}
  ${parameterList({ prefix: "data.", withRequestConfig: true })}
  ));
}
/**
 * Prefetch ${hookName} via the queryClient
 */
 ${hookName}.prefetch = (
  ${queryClientArgument}
  ${axiosInstanceArgument}
 ${
   route.params || route.query || route.body
     ? `data: { ${argumentList({ suffix: ";", withRequestConfig: true }).join(
         "\n",
       )} },`
     : ""
 }
 ) => {
  return queryClient.prefetchQuery(${hookName}.queryKey(
    ${parameterList({ prefix: "data.", withRequestConfig: false })}
  ), () => ${apiName}(
     ${axiosInstanceParameter}
     ${parameterList({ prefix: "data.", withRequestConfig: true })}
  ));
}

/**
 * Invalidate ${hookName} via the queryClient
 */
${hookName}.invalidate = (
  ${queryClientArgument}
  ${
    route.params || route.query || route.body
      ? `queryKey: { ${argumentList({
          suffix: ";",
          withRequestConfig: false,
        }).join("\n")} }`
      : ""
  }
) => queryClient.invalidateQueries(${hookName}.queryKey(
    ${parameterList({ prefix: "queryKey.", withRequestConfig: false })}
));
  

/**
 * Set query data for ${hookName} via the queryClient
 */
${hookName}.setQueryData = (
   ${queryClientArgument}
  ${
    route.params || route.query || route.body
      ? `queryKey: { ${argumentList({
          suffix: ";",
          withRequestConfig: false,
        }).join("\n")} },`
      : ""
  }
      data: ${contextNames.responseTypeName},
) => queryClient.setQueryData(${hookName}.queryKey(
  ${parameterList({ prefix: "queryKey.", withRequestConfig: false })}
), data);
`,
    );
  } else {
    // Write the props type
    fileBlockStart(file, `interface ${upperCaseFirst(hookName)}Props`);
    fileWrite(
      file,
      argumentList({ suffix: ";", withRequestConfig: true }).join("\n"),
    );
    fileBlockEnd(file);

    fileWriteInline(
      file,
      `export function ${hookName}(options: UseMutationOptions<${
        contextNames.responseTypeName
      }, AxiosError|ResponseError, ${upperCaseFirst(hookName)}Props> = {},`,
    );

    if (route.invalidations.length > 0) {
      // Accept an option to invalidate the queries.
      fileWriteInline(
        file,
        `hookOptions: { invalidateQueries?: boolean } = {},`,
      );
    }

    fileWrite(
      file,
      `): UseMutationResult<${
        contextNames.responseTypeName
      }, AxiosError|ResponseError, ${upperCaseFirst(
        hookName,
      )}Props, unknown> {`,
    );

    if (!hasGlobalClient) {
      fileWrite(file, `const axiosInstance = useApi();`);
    }

    if (route.invalidations) {
      if (!hasGlobalClient) {
        fileWrite(file, `const queryClient = useQueryClient();`);
      }
    }

    // Write out the invalidatiosn
    fileBlockStart(file, `if (hookOptions.invalidateQueries)`);
    axiosReactQueryWriteInvalidations(file, route);
    fileBlockEnd(file);

    fileWrite(
      file,
      `return useMutation((variables) => ${apiName}(
   ${axiosInstanceParameter}
  ${parameterList({ prefix: "variables.", withRequestConfig: true })}
), options);
`,
    );

    fileBlockEnd(file);
  }
  fileWrite(file, "\n");
}

/**
 * Generate the api client hooks
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 */
function axiosReactQueryWriteIsEnabled(generateContext, file, route) {
  const keysAffectingEnabled = [];

  for (const key of ["params", "query", "body"]) {
    if (!route[key]) {
      continue;
    }

    const type = structureResolveReference(
      generateContext.structure,
      route[key],
    );

    if (type.type !== "object") {
      // @ts-expect-error
      const isOptional = typesOptionalityIsOptional(generateContext, type, {
        validatorState: "input",
      });

      if (!isOptional) {
        keysAffectingEnabled.push(`opts.${key}`);
      }

      continue;
    }

    for (const [subKey, field] of Object.entries(type.keys)) {
      const isOptional = typesOptionalityIsOptional(generateContext, field, {
        validatorState: "input",
      });

      if (!isOptional) {
        keysAffectingEnabled.push(`opts.${key}.${subKey}`);
      }
    }
  }

  if (keysAffectingEnabled.length > 0) {
    fileWrite(file, `options.enabled = (`);
    fileContextSetIndent(file, 1);

    fileWrite(
      file,
      `options.enabled === true || (options.enabled !== false &&`,
    );
    fileWrite(
      file,
      keysAffectingEnabled
        .map((it) => `${it} !== undefined && ${it} !== null`)
        .join("&&\n"),
    );

    fileContextSetIndent(file, -1);
    fileWrite(file, `));`);
  }
}

/**
 * Write the invalidations in the mutation hook
 *
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 */
function axiosReactQueryWriteInvalidations(file, route) {
  fileWrite(file, `const originalOnSuccess = options.onSuccess;`);
  fileBlockStart(
    file,
    `options.onSuccess = async (data, variables, context) => `,
  );

  for (const invalidation of route.invalidations) {
    let params = "";
    let query = "";

    if (
      invalidation.target.name &&
      Object.keys(invalidation.properties.specification?.params ?? {}).length >
        0
    ) {
      params += `{`;
      for (const [key, value] of Object.entries(
        invalidation.properties?.specification?.params ?? {},
      )) {
        params += `${key}: variables.${value.join(".")},\n`;
      }
      params += `},`;
    }

    if (
      invalidation.target.name &&
      Object.keys(invalidation.properties.specification?.query ?? {}).length > 0
    ) {
      query += `{`;
      for (const [key, value] of Object.entries(
        invalidation.properties?.specification?.query ?? {},
      )) {
        query += `${key}: variables.${value.join(".")},\n`;
      }
      query += `},`;
    }

    fileWriteInline(
      file,
      `queryClient.invalidateQueries(["${invalidation.target.group}",`,
    );
    if (invalidation.target.name) {
      fileWriteInline(file, `"${invalidation.target.name}",`);
    }
    if (params.length) {
      fileWriteInline(file, params);
    }
    if (query.length) {
      fileWriteInline(file, query);
    }
    fileWrite(file, `]);`);
  }

  fileBlockStart(file, `if (typeof originalOnSuccess === "function")`);
  fileWrite(file, `return await originalOnSuccess(data, variables, context);`);

  fileBlockEnd(file);
  fileBlockEnd(file);
}
