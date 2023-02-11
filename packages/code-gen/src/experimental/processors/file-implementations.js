/**
 * @type {NonNullable<import("../generated/common/types.js").ExperimentalAnyDefinition["targets"]>}
 */
export const fileImplementations = {
  jsKoaReceive: {
    validatorInputType: "any",
    validatorOutputType: `import("formidable").PersistentFile`,
    validatorImport: `import formidable from "formidable";`,
    validatorExpression: `$value$ instanceof formidable.PersistentFile`,
  },
  jsKoaSend: {
    validatorInputType: `Buffer|import("stream").Readable`,
    validatorOutputType: `Buffer|import("stream").Readable`,
  },
  jsAxios: {
    validatorInputType: `{ name?: string, data: import("stream").Readable|Buffer }`,
    validatorOutputType: `import("stream").Readable`,
    validatorExpression: `typeof $value$.pipe === "function" && typeof $value$._read === "function"`,
  },
  tsAxiosBrowser: {
    validatorInputType: `{ name?: string, data: Blob }`,
    validatorOutputType: `Blob`,
    validatorExpression: `$value$ instanceof Blob`,
  },
  tsAxiosReactNative: {
    validatorInputType: `(string | { name?: string, type?: string, uri: string })`,
    validatorOutputType: `Blob`,
    validatorExpression: `$value$ instanceof Blob`,
  },
};
