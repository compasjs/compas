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
import { apiClientDistilledTargetInfo } from "./generator.js";

/**
 * Get the api client file
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../generated/common/types").ExperimentalRouteDefinition} route
 * @returns {import("../file/context").GenerateFile}
 */
export function reactQueryGetApiClientFile(generateContext, route) {
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

  const distilledTargetInfo = apiClientDistilledTargetInfo(generateContext);
  const importCollector = JavascriptImportCollector.getImportCollector(file);

  if (distilledTargetInfo.useGlobalClients) {
    // Import the global clients, this has affect on a bunch of the generated api's where we don't have to accept these arguments
    if (distilledTargetInfo.isAxios) {
      importCollector.destructure(`../common/api-client`, "axiosInstance");
    }

    importCollector.destructure("../common/api-client", "queryClient");
  } else {
    // Import ways to infer or accept the clients
    importCollector.destructure("../common/api-client", "useApi");
    importCollector.destructure("@tanstack/react-query", "useQueryClient");

    if (distilledTargetInfo.isAxios) {
      importCollector.destructure("axios", "AxiosInstance");
    }
  }

  // Error handling
  importCollector.destructure("../common/api-client", "AppErrorResponse");

  if (distilledTargetInfo.isAxios) {
    importCollector.destructure("axios", "AxiosError");
    importCollector.destructure("axios", "AxiosRequestConfig");
  }

  // @tanstack/react-query imports
  importCollector.destructure("@tanstack/react-query", "QueryKey");
  importCollector.destructure("@tanstack/react-query", "UseMutationOptions");
  importCollector.destructure("@tanstack/react-query", "UseMutationResult");
  importCollector.destructure("@tanstack/react-query", "UseQueryOptions");
  importCollector.destructure("@tanstack/react-query", "UseQueryResult");
  importCollector.destructure("@tanstack/react-query", "useMutation");
  importCollector.destructure("@tanstack/react-query", "useQuery");
  importCollector.destructure("@tanstack/react-query", "QueryClient");

  return file;
}

/**
 * Generate the api client hooks
 *
 * @param {import("../generate").GenerateContext} generateContext
 * @param {import("../file/context").GenerateFile} file
 * @param {import("../types").NamedType<import("../generated/common/types").ExperimentalRouteDefinition>} route
 * @param {Record<string, string>} contextNames
 */
export function reactQueryGenerateFunction(
  generateContext,
  file,
  route,
  contextNames,
) {
  const distilledTargetInfo = apiClientDistilledTargetInfo(generateContext);

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
  const joinedArgumentType = ({ withRequestConfig, withQueryOptions }) => {
    const list = [
      contextNames.paramsTypeName,
      contextNames.queryTypeName,
      contextNames.bodyTypeName,
      contextNames.filesTypeName,
      withRequestConfig
        ? `{ requestConfig?: ${
            distilledTargetInfo.isAxios
              ? `AxiosRequestConfig`
              : distilledTargetInfo.isFetch
              ? `RequestInit`
              : "unknown"
          }${
            route.response && !distilledTargetInfo.skipResponseValidation
              ? `, skipResponseValidation?: boolean`
              : ""
          } }`
        : undefined,
      withQueryOptions
        ? `{ queryOptions?: UseQueryOptions<${
            contextNames.responseTypeName ?? "unknown"
          }, AppErrorResponse, TData> }`
        : undefined,
    ].filter((it) => !!it);

    if (list.length === 0) {
      list.push(`{}`);
    }

    return list.join(` & `);
  };

  const parameterListWithExtraction = ({ prefix, withRequestConfig }) => {
    let result = "";

    if (route.params) {
      const params = structureResolveReference(
        generateContext.structure,
        route.params,
      );

      result += `{ ${Object.keys(params.keys)
        .map((it) => `"${it}": ${prefix}["${it}"]`)
        .join(", ")} }, `;
    }

    if (route.query) {
      const query = structureResolveReference(
        generateContext.structure,
        route.query,
      );

      result += `{ ${Object.keys(query.keys)
        .map((it) => `"${it}": ${prefix}["${it}"]`)
        .join(", ")} }, `;
    }

    if (route.body) {
      const body = structureResolveReference(
        generateContext.structure,
        route.body,
      );

      result += `{ ${Object.keys(body.keys)
        .map((it) => `"${it}": ${prefix}["${it}"]`)
        .join(", ")} }, `;
    }

    if (route.files) {
      const files = structureResolveReference(
        generateContext.structure,
        route.files,
      );

      result += `{ ${Object.keys(files.keys)
        .map((it) => `"${it}": ${prefix}["${it}"]`)
        .join(", ")} }, `;
    }

    if (withRequestConfig) {
      result += `${prefix}.requestConfig`;
    }

    return result;
  };

  const apiInstanceArgument = distilledTargetInfo.useGlobalClients
    ? ""
    : distilledTargetInfo.isAxios
    ? `axiosInstance: AxiosInstance,`
    : distilledTargetInfo.isFetch
    ? "fetchFn: Fetch"
    : "";
  const apiInstanceParameter = distilledTargetInfo.useGlobalClients
    ? ""
    : distilledTargetInfo.isAxios
    ? "axiosInstance,"
    : distilledTargetInfo.isFetch
    ? "fetchFn,"
    : "";
  const queryClientArgument = distilledTargetInfo.useGlobalClients
    ? ""
    : `queryClient: QueryClient,`;

  if (route.method === "GET" || route.idempotent) {
    fileWriteInline(
      file,
      `export function ${hookName}<TData = ${contextNames.responseTypeName}>(`,
    );

    // When no arguments are required, the whole opts object is optional
    const routeHasMandatoryInputs =
      route.params || route.query || route.body || route.files;
    if (routeHasMandatoryInputs) {
      fileWrite(file, `opts: `);
    } else {
      fileWrite(file, `opts?: `);
    }

    fileWrite(
      file,
      joinedArgumentType({
        withRequestConfig: true,
        withQueryOptions: true,
      }),
    );

    // When no arguments are required, the whole opts object is optional
    if (routeHasMandatoryInputs) {
      fileBlockStart(file, `)`);
    } else {
      fileBlockStart(file, `|undefined)`);
    }

    if (!distilledTargetInfo.useGlobalClients) {
      // Get the api client from the React context
      if (distilledTargetInfo.isAxios) {
        fileWrite(file, `const axiosInstance = useApi();`);
      }
      if (distilledTargetInfo.isFetch) {
        fileWrite(file, `const fetchFn = useApi();`);
      }
    }

    if (!routeHasMandatoryInputs) {
      fileWrite(file, `opts ??= {};`);
    }

    fileWrite(file, `const options = opts?.queryOptions ?? {};`);
    reactQueryWriteIsEnabled(generateContext, file, route);

    fileWriteInline(
      file,
      `return useQuery(${hookName}.queryKey(${
        routeHasMandatoryInputs ? "opts" : ""
      }),`,
    );
    fileWriteInline(
      file,
      `({ signal }) => {
  ${!routeHasMandatoryInputs ? "if (opts) {" : ""}
  opts.requestConfig ??= {};
  opts.requestConfig.signal = signal;
  ${!routeHasMandatoryInputs ? "}" : ""}
  
    
  return ${apiName}(${apiInstanceParameter}
  ${parameterListWithExtraction({
    prefix: "opts",
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
  ${
    routeHasMandatoryInputs
      ? `opts: ${joinedArgumentType({
          withQueryOptions: false,
          withRequestConfig: false,
        })},`
      : ""
  }
): QueryKey => [
  ...${hookName}.baseKey(),
  ${parameterListWithExtraction({ prefix: "opts", withRequestConfig: false })}
];

/**
 * Fetch ${hookName} via the queryClient and return the result
 */
 ${hookName}.fetch = (
  ${queryClientArgument}
  ${apiInstanceArgument}
  opts${routeHasMandatoryInputs ? "" : "?"}: ${joinedArgumentType({
        withQueryOptions: false,
        withRequestConfig: true,
      })}
 ) => {
  return queryClient.fetchQuery(
    ${hookName}.queryKey(${routeHasMandatoryInputs ? "opts" : ""}),
    () => ${apiName}(
   ${apiInstanceParameter}
  ${parameterListWithExtraction({
    prefix: "opts",
    withRequestConfig: true,
  })}
  ));
}

/**
 * Prefetch ${hookName} via the queryClient
 */
 ${hookName}.prefetch = (
  ${queryClientArgument}
  ${apiInstanceArgument}
  opts${routeHasMandatoryInputs ? "" : "?"}: ${joinedArgumentType({
        withQueryOptions: false,
        withRequestConfig: true,
      })},
 ) => {
  return queryClient.prefetchQuery(
    ${hookName}.queryKey(${routeHasMandatoryInputs ? "opts" : ""}),
    () => ${apiName}(
     ${apiInstanceParameter}
     ${parameterListWithExtraction({
       prefix: "opts",
       withRequestConfig: true,
     })}
  ));
}

/**
 * Invalidate ${hookName} via the queryClient
 */
${hookName}.invalidate = (
  ${queryClientArgument}
  ${
    routeHasMandatoryInputs
      ? `opts: ${joinedArgumentType({
          withQueryOptions: false,
          withRequestConfig: false,
        })},`
      : ""
  }
) => queryClient.invalidateQueries(${hookName}.queryKey(${
        routeHasMandatoryInputs ? "opts" : ""
      }));
  

/**
 * Set query data for ${hookName} via the queryClient
 */
${hookName}.setQueryData = (
  ${queryClientArgument}
  ${
    routeHasMandatoryInputs
      ? `opts: ${joinedArgumentType({
          withQueryOptions: false,
          withRequestConfig: false,
        })},`
      : ""
  }
  data: ${contextNames.responseTypeName ?? "unknown"},
) => queryClient.setQueryData(${hookName}.queryKey(${
        routeHasMandatoryInputs ? "opts" : ""
      }), data);
`,
    );
  } else {
    // Write the props type
    fileWrite(
      file,
      `type ${upperCaseFirst(hookName)}Props = ${joinedArgumentType({
        withRequestConfig: true,
      })}`,
    );

    fileWriteInline(
      file,
      `export function ${hookName}(options: UseMutationOptions<${
        contextNames.responseTypeName
      }, AppErrorResponse, ${upperCaseFirst(hookName)}Props> = {},`,
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
      }, AppErrorResponse, ${upperCaseFirst(hookName)}Props, unknown> {`,
    );

    if (!distilledTargetInfo.useGlobalClients) {
      // Get the api client from the React context
      if (distilledTargetInfo.isAxios) {
        fileWrite(file, `const axiosInstance = useApi();`);
      }
      if (distilledTargetInfo.isFetch) {
        fileWrite(file, `const fetchFn = useApi();`);
      }
    }

    if (route.invalidations) {
      if (!distilledTargetInfo.useGlobalClients) {
        fileWrite(file, `const queryClient = useQueryClient();`);
      }
    }

    if (route.invalidations.length > 0) {
      // Write out the invalidatiosn
      fileBlockStart(file, `if (hookOptions.invalidateQueries)`);
      reactQueryWriteInvalidations(file, route);
      fileBlockEnd(file);
    }

    fileWrite(
      file,
      `return useMutation((variables) => ${apiName}(
   ${apiInstanceParameter}
  ${parameterListWithExtraction({
    prefix: "variables",
    withRequestConfig: true,
  })}
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
function reactQueryWriteIsEnabled(generateContext, file, route) {
  const keysAffectingEnabled = [];

  for (const key of ["params", "query", "body"]) {
    if (!route[key]) {
      continue;
    }

    const type = structureResolveReference(
      generateContext.structure,
      route[key],
    );

    for (const [subKey, field] of Object.entries(type.keys)) {
      const isOptional = typesOptionalityIsOptional(generateContext, field, {
        validatorState: "input",
      });

      if (!isOptional) {
        keysAffectingEnabled.push(`opts.${subKey}`);
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
function reactQueryWriteInvalidations(file, route) {
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
        params += `${key}: variables.${value.slice(1).join(".")},\n`;
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
        query += `${key}: variables.${value.slice(1).join(".")},\n`;
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
