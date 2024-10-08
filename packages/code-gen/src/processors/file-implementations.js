/**
 * @type {NonNullable<import("../generated/common/types.d.ts").StructureAnyDefinition["targets"]>}
 */
export const fileImplementations = {
  jsKoaReceive: {
    validatorInputType: "any",
    validatorOutputType: `import("formidable").File`,
    validatorImport: `import formidable from "formidable";`,
    validatorExpression: `$value$ instanceof formidable.File`,
  },
  tsKoaReceive: {
    validatorInputType: "any",
    validatorOutputType: `import("formidable").File`,
    validatorImport: `import formidable from "formidable";`,
    validatorExpression: `$value$ instanceof formidable.File`,
  },
  jsKoaSend: {
    validatorInputType: `Buffer|import("stream").Readable`,
    validatorOutputType: `Buffer|import("stream").Readable`,
    validatorExpression: `$value$ instanceof Buffer || (typeof $value$.pipe === "function" && typeof $value$._read === "function")`,
  },
  tsKoaSend: {
    validatorInputType: `Buffer|import("stream").Readable`,
    validatorOutputType: `Buffer|import("stream").Readable`,
    validatorExpression: `$value$ instanceof Buffer || (typeof $value$ === "object" && "pipe" in $value$ && "_read" in $value$ && typeof $value$.pipe === "function" && typeof $value$._read === "function")`,
  },
  jsAxios: {
    validatorInputType: `{ name?: string, data: import("stream").Readable|Buffer }`,
    validatorOutputType: `import("stream").Readable`,
    validatorExpression: `typeof $value$.pipe === "function" && typeof $value$._read === "function"`,
  },
  tsAxios: {
    validatorInputType: `{ name?: string, data: import("stream").Readable|Buffer }`,
    validatorOutputType: `import("stream").Readable`,
    validatorExpression: `typeof $value$ === "object" && "pipe" in $value$ && "_read" in $value$ && typeof $value$.pipe === "function" && typeof $value$._read === "function"`,
  },
  jsFetch: {
    validatorInputType: `{ name?: string, data: Blob }`,
    validatorOutputType: `Blob`,
    validatorExpression: `$value$ instanceof Blob`,
  },
  tsAxiosBrowser: {
    validatorInputType: `{ name?: string, data: Blob }`,
    validatorOutputType: `Blob`,
  },
  tsFetchBrowser: {
    validatorInputType: `{ name?: string, data: Blob }`,
    validatorOutputType: `Blob`,
  },
  tsAxiosReactNative: {
    validatorInputType: `(string | { name?: string, type?: string, uri: string })`,
    validatorOutputType: `Blob`,
  },
  tsFetchReactNative: {
    validatorInputType: `(string | { name?: string, type?: string, uri: string })`,
    validatorOutputType: `Blob`,
  },
};
