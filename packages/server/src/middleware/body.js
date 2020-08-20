import { AppError } from "@lbu/stdlib";
import formidable from "formidable";
import koaBody from "koa-body";
import qs from "qs";

/**
 * Creates a body parser and a body parser with multipart enabled
 * Note that koa-body parses url-encoded, form data, json and text by default
 *
 * @param {IKoaBodyOptions} [bodyOpts={}] Options that will be passed to koa-body
 * @param {IFormidableBodyOptions} [multipartBodyOpts={}] Options that will be passed to formidable
 * @returns {BodyParserPair}
 */
export function createBodyParsers(bodyOpts = {}, multipartBodyOpts = {}) {
  // disable formidable
  bodyOpts.mutipart = false;

  return {
    bodyParser: koaBody(bodyOpts),
    multipartBodyParser: koaFormidable(multipartBodyOpts),
  };
}

/**
 * Wrapper around Formidable, making it compatible iwth KoaMiddaleware
 * Implemantion is based on formidable.parse calback method, with some
 * changes for 'boolean' and 'array' support. multiples enabled and required.
 *
 * Source; https://github.com/node-formidable/formidable/blob/master/src/Formidable.js#L103
 *
 * @param {IFormidableBodyOptions} opts
 * @returns {Middleware}
 */
function koaFormidable(opts = {}) {
  // support for arrays
  opts.multiples = true;

  return (ctx, next) => {
    if (!ctx.is("multipart/*")) {
      throw new AppError("error.server.unsupportedMediaType", 415);
    }

    return new Promise((resolve, reject) => {
      const form = formidable(opts);

      let mockFields = "";
      const fields = {};
      const files = {};

      // skips query string conversion for object/array
      // types, since this is done in the apiClient
      form.on("field", (name, value) => {
        // check if object
        if (value.indexOf("&") === 0) {
          mockFields = `${mockFields}&${value}`;
        } else {
          const mObj = { [name]: value };
          mockFields = `${mockFields}&${qs.stringify(mObj)}`;
        }
      });
      form.on("file", (name, file) => {
        if (Object.prototype.hasOwnProperty.call(files, name)) {
          if (!Array.isArray(files[name])) {
            files[name] = [files[name]];
          }
          files[name].push(file);
        } else {
          files[name] = file;
        }
      });
      form.on("error", (err) => {
        reject(AppError.serverError({ fields, files }, err));
      });
      form.on("end", () => {
        Object.assign(fields, qs.parse(mockFields));
        resolve({ fields, files });
      });
      form.parse(ctx.req);
    }).then(({ fields, files }) => {
      ctx.request.body = fields;
      ctx.request.files = files;
      return next();
    });
  };
}
