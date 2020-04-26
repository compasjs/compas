import { merge } from "@lbu/stdlib";
import minio from "minio";

/**
 * @param {object} opts
 * @return {minio.Client}
 */
export function newMinioClient(opts) {
  const config = {
    endPoint: process.env.MINIO_URI,
    port: process.env.MINIO_PORT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: process.env.NODE_ENV === "production",
  };
  return new minio.Client(merge(config, opts));
}

export { minio };
