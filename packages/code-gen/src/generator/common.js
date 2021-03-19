import { js } from "./tag/tag.js";

/**
 * Generate common files depending on the enabled generators.
 *
 * @param {CodeGenContext} context
 */
export function generateCommonFiles(context) {
  if (context.options.enabledGenerators.includes("apiClient")) {
    context.outputFiles.push({
      contents: generateCommonApiClientFiles(context),
      relativePath: `./common/apiClient${context.extension}`,
    });
  }
}

/**
 * @param {CodeGenContext} context
 * @returns {string}
 */
function generateCommonApiClientFiles(context) {
  let contents = "";

  if (context.options.isNodeServer) {
    contents += js`
         import { AppError, streamToBuffer } from "@compas/stdlib";

         export function handleError(e, group, name) {
            // Validator error
            if (AppError.instanceOf(e)) {
               e.key = \`response.$\{group}.$\{name}.$\{e.key}\`
               throw e;
            }

            if (typeof e?.response?.data?.pipe === "function") {
               // Handle response streams
               return streamToBuffer(e.response.data).then(buffer => {
                  try {
                     e.response.data = JSON.parse(buffer.toString("utf8"));
                  } catch {
                     // Unknown error
                     throw new AppError(\`response.$\{group}.$\{name}\`,
                                        e.response?.status ?? 500, {
                                           data: e?.response?.data,
                                           headers: e?.response?.headers
                                        }, e,
                     );
                  }

                  return handleError(e, group, name);
               });
            }

            // Server AppError
            const { key, info } = e.response?.data ?? {};
            if (typeof key === "string" && !!info && typeof info === "object") {
               throw new AppError(key, e.response.status, info, e);
            }

            // Unknown error
            throw new AppError(\`response.$\{group}.$\{name}\`, e.response?.status ?? 500,
                               { data: e?.response?.data, headers: e?.response?.headers },
                               e,
            );
         }
      `;
  }

  if (context.options.useTypescript) {
    contents += `import { AxiosInstance } from "axios";`;
  }

  contents += js`
      export function addRequestIdInterceptors(instance

      ${context.options.useTypescript ? ": AxiosInstance" : ""}
      )
      {
         let requestId
         ${
           context.options.useTypescript ? ": string | undefined" : ""
         } = undefined;
         instance.interceptors.request.use((config) => {
            if (requestId) {
               config.headers["x-request-id"] = requestId;
            }
            return config;
         });

         instance.interceptors.response.use((response) => {
            if (response.headers["x-request-id"]) {
               requestId = response.headers["x-request-id"];
            }
            return response;
         }, (error) => {
            if (error.response && error.response.headers["x-request-id"]) {
               requestId = error.response.headers["x-request-id"];
            }
            return Promise.reject(error);
         });
      }
   `;

  return contents;
}
