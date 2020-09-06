import {
  addCommonjsImport,
  js,
  setupImports,
} from "../../../templates/index.js";
import { getItem } from "../../../utils.js";

/**
 * @param {GenerateOpts} options
 * @param {CodeGenStructure} structure
 * @returns {string}
 */
export function apiClientFile({ options, structure }) {
  return js`
${options.fileHeader}
${setupImports()}

${
  options.enabledGenerators.indexOf("router") !== -1
    ? addCommonjsImport("FormData", "form-data")
    : ""
}

let _internalClient = undefined;
let requestId = undefined;

function checkApiClient() {
  if (_internalClient === undefined) {
    throw new Error("Initialize api client with createApiClient");
  }
}

/**
 * Should set an axios compatible api client
 * @param {AxiosInstance} instance
 */
export function createApiClient(instance) {
  _internalClient = instance;

  _internalClient.interceptors.request.use((config) => {
      if (requestId) {
        config.headers["x-request-id"] = requestId;
      }
      return config;
  });

  _internalClient.interceptors.response.use((response) => {
    if (response.headers["x-request-id"]) {
      requestId = response.headers["x-request-id"];
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.headers["x-request-id"]) {
      requestId = error.response.headers["x-request-id"];
    }
    return Promise.reject(error);
  });
}

${renderApiGroups(options, structure)}
`;
}

function renderApiGroups(options, structure) {
  const result = [];

  for (const groupName of Object.keys(structure)) {
    const routes = Object.values(structure[groupName])
      .filter((it) => it.type === "route")
      .map((type) => renderApiFunction(options, type));

    if (routes.length > 0) {
      result.push(js`
export const ${groupName}Api = {
  ${routes}
};
`);
    }
  }

  return result;
}

/**
 * @param {GenerateOpts} options
 * @param {CodeGenRouteType} type
 */
function renderApiFunction(options, type) {
  const url = type.path
    .split("/")
    .map((part) => {
      if (part.startsWith(":")) {
        return `\${params.${part.substring(1)}}`;
      }
      return part;
    })
    .join("/");
  const buildTypeQualifier = (uniqueName, inputType) =>
    `${options.useTypescript ? 'import("./types").' : ""}${uniqueName}${
      inputType ? "_Input" : ""
    }`;
  const responseType = type.response
    ? getItem(type.response).type === "file"
      ? options.enabledGenerators.indexOf("router") !== -1
        ? "ReadableStream"
        : "Blob"
      : buildTypeQualifier(type.response.reference.uniqueName, false)
    : "*";

  return js`
    /**
     * ${type.uniqueName}
     * Tags: ${type.tags.join(", ")}
     * Docs: ${type.docString}
     * ${
       type.params &&
       `@param {${buildTypeQualifier(
         type.params.reference.uniqueName,
         true,
       )}} params`
     }
     * ${
       type.query &&
       `@param {${buildTypeQualifier(
         type.query.reference.uniqueName,
         true,
       )}} query`
     }
     * ${
       type.body &&
       `@param {${buildTypeQualifier(
         type.body.reference.uniqueName,
         true,
       )}} body`
     }
     * ${
       type.files &&
       `@param {${buildTypeQualifier(
         type.files.reference.uniqueName,
         true,
       )}} files`
     }
     * @returns {Promise<${responseType}>}
     */
     ${type.name}: async (
       ${type.params && "params,"}
       ${type.query && "query,"}
       ${type.body && "body,"}
       ${type.files && "files,"}
     ) => {
       checkApiClient();
       
       ${
         type.files
           ? js`
    // eslint-disable-next-line
    const data = new FormData();
    for (const key of Object.keys(files)) {
      const keyFiles = Array.isArray(files[key]) ? files[key] : [ files[key] ];
      for (const file of keyFiles) {
        data.append(key, file.data, file.name);
      }
    }`
           : type.body
           ? `const data = body;`
           : ""
       }
       
       const response = await _internalClient.request({
        url: \`${url}\`,
        method: "${type.method}",
        params: ${type.query ? "query" : "{}"},
        data: ${type.files || type.body ? "data" : "{}"},
        ${() => {
          if (
            type.files &&
            options.enabledGenerators.indexOf("router") !== -1
          ) {
            return js`headers: data.getHeaders(),`;
          }
          return "";
        }}
        ${() => {
          if (type.response && getItem(type.response).type === "file") {
            const responseType =
              options.enabledGenerators.indexOf("router") !== -1
                ? "stream"
                : "blob";

            return `responseType: "${responseType}",`;
          }
          return "";
        }}
      });
      
      return response.data;
     },
  `;
}
