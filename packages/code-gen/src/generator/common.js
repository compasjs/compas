import { js } from "./tag/tag.js";

/**
 * Generate common files depending on the enabled generators.
 * Not all generators use this way of generating a common file as some have a computed
 * generated output that is shared over all groups.
 * These generators will write to the common directory them selves.
 *
 * @param {CodeGenContext} context
 */
export function generateCommonFiles(context) {
  if (context.options.enabledGenerators.includes("apiClient")) {
    context.outputFiles.push({
      contents: generateCommonApiClientFile(context),
      relativePath: `./common/apiClient${context.extension}`,
    });
  }

  if (context.options.enabledGenerators.includes("reactQuery")) {
    context.outputFiles.push({
      contents: generateCommonReactQueryFile(),
      relativePath: `./common/reactQuery${context.extension}x`,
    });
  }
}

/**
 * @param {CodeGenContext} context
 * @returns {string}
 */
function generateCommonApiClientFile(context) {
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

/**
 * @returns {string}
 */
function generateCommonReactQueryFile() {
  return `
import { AxiosError, AxiosInstance, CancelTokenSource } from "axios";
import { createContext, PropsWithChildren, useContext } from "react";
import {
  UseQueryOptions as ReactUseQueryOptions,
} from "react-query";

export interface CancellablePromise<T> extends Promise<T> {
  cancel?: () => void;
}

const ApiContext = createContext<AxiosInstance | undefined>(undefined);

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
};

export type AppErrorResponse = AxiosError<{
  key?: string;
  message?: string;
  info?: {
    _error?: {
      name?: string;
      message?: string;
      stack?: string[];
    };
    [key: string]: any;
  };
}>;

export type UseQueryOptions<Response, Error> = ReactUseQueryOptions<Response, Error> & { cancelToken?: CancelTokenSource };
`;
}
