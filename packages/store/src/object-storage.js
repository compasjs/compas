import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  paginateListObjectsV2,
  S3Client,
} from "@aws-sdk/client-s3";
import { AppError, isNil } from "@compas/stdlib";

/**
 * Get the development config that works with the default `compas docker up` created
 * Minio container.
 *
 * Only use this container and default config when `!isProduction()`!
 *
 * @returns {Partial<import("@aws-sdk/client-s3").S3ClientConfig>}
 */
export function objectStorageGetDevelopmentConfig() {
  return {
    credentials: {
      accessKeyId: "minio",
      secretAccessKey: "minio123",
    },
    endpoint: "http://127.0.0.1:9000",
    forcePathStyle: true,
    region: "eu-central-1",
  };
}

/**
 * Create a new S3Client.
 *
 * @param {import("@aws-sdk/client-s3").S3ClientConfig} config
 * @returns {import("@aws-sdk/client-s3").S3Client}
 */
export function objectStorageCreateClient(config) {
  return new S3Client(config);
}

/**
 * Check if the supplied bucketName exists, else create it in the (optional) location.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   locationConstraint?: import("@aws-sdk/client-s3").BucketLocationConstraint,
 *   createBucketOverrides?: Partial<import("@aws-sdk/client-s3").CreateBucketCommandInput>,
 * }} options
 * @returns {Promise<void>}
 */
export async function objectStorageEnsureBucket(s3Client, options) {
  if (isNil(options?.bucketName)) {
    throw AppError.serverError({
      message: "Parameter 'options.bucketName' is required.",
    });
  }

  if (
    isNil(s3Client.config.region) ||
    (typeof s3Client.config.region === "function" &&
      isNil(await s3Client.config.region()))
  ) {
    throw AppError.serverError({
      message:
        "The S3 client is created without a region, make sure to set a region in your environment, the config object or config/credentials files.",
    });
  }

  try {
    const headBucketResult = await s3Client.send(
      new HeadBucketCommand({ Bucket: options.bucketName }),
    );

    if (headBucketResult.$metadata.httpStatusCode === 200) {
      return;
    }
  } catch (e) {
    // @ts-expect-error
    if (e.name !== "NotFound") {
      throw AppError.serverError(
        {
          message: "Could not create S3 bucket",
        },
        e,
      );
    }
  }

  const createBucketResult = await s3Client.send(
    new CreateBucketCommand({
      Bucket: options.bucketName,
      ACL: "private",
      CreateBucketConfiguration: {
        LocationConstraint: options.locationConstraint,
      },
      ...options.createBucketOverrides,
    }),
  );

  if (createBucketResult.$metadata.httpStatusCode !== 200) {
    throw AppError.serverError({
      message: `Could not create the '${options.bucketName}' bucket.`,
      metadata: createBucketResult.$metadata,
    });
  }
}

/**
 * Remove a bucket. Note that a bucket should be empty before it can be removed.
 * Pass `options.includeAllObjects` to remove any left over object in the bucket before
 * removing the bucket.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   includeAllObjects?: boolean,
 * }} options
 * @returns {Promise<void>}
 */
export async function objectStorageRemoveBucket(s3Client, options) {
  if (isNil(options?.bucketName)) {
    throw AppError.serverError({
      message: "Parameter 'options.bucketName' is required.",
    });
  }

  if (options.includeAllObjects === true) {
    // The max page size of listObjectsV2 is the same as the max amount of keys that can
    // be sent to deleteObjects, so we can map the result directly to the delete request.
    for await (const partial of objectStorageListObjects(s3Client, {
      bucketName: options.bucketName,
    })) {
      if (isNil(partial.Contents)) {
        continue;
      }

      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: options.bucketName,
          Delete: {
            Objects: partial.Contents.map((it) => ({ Key: it.Key })),
            Quiet: true,
          },
        }),
      );
    }
  }

  await s3Client.send(
    new DeleteBucketCommand({
      Bucket: options.bucketName,
    }),
  );
}

/**
 * Creates a listObjectsV2 async iterator.
 * Can be used like:
 * ```
 * for await (const objects of objectStorageListObjects(s3Client, { bucketName }) {
 *   // your code using `objects.Contents`;
 * }
 * ```
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 * }} options
 * @returns {ReturnType<typeof import("@aws-sdk/client-s3").paginateListObjectsV2>}
 */
export function objectStorageListObjects(s3Client, options) {
  if (isNil(options?.bucketName)) {
    throw AppError.serverError({
      message: "Parameter 'options.bucketName' is required.",
    });
  }

  return paginateListObjectsV2(
    {
      client: s3Client,
    },
    {
      Bucket: options.bucketName,
    },
  );
}

/**
 * Get a Readable stream for the specified `bucketName` and `objectKey` combination.
 * Normally, the objectKey is the same as `StoreFile#id`. You can also provide an
 * optional range, to support HTTP range requests, mostly used for video players.
 *
 * @param {import("@aws-sdk/client-s3").S3Client} s3Client
 * @param {{
 *   bucketName: string,
 *   objectKey: string,
 *   range?: {
 *     start?: number,
 *     end?: number,
 *   },
 * }} options
 * @returns {Promise<NodeJS.ReadableStream>}
 */
export async function objectStorageGetObjectStream(s3Client, options) {
  if (isNil(options?.bucketName)) {
    throw AppError.serverError({
      message: "Parameter 'options.bucketName' is required.",
    });
  }
  if (isNil(options?.objectKey)) {
    throw AppError.serverError({
      message: "Parameter 'options.objectKey' is required.",
    });
  }

  let range = undefined;
  if (options.range) {
    range = `bytes=${options.range.start ?? 0}-${options.range.end ?? ""}`;
  }

  const getObjectResult = await s3Client.send(
    new GetObjectCommand({
      Bucket: options.bucketName,
      Key: options.objectKey,
      Range: range,
    }),
  );

  // @ts-expect-error this could be a Blob as well
  return getObjectResult.Body;
}
