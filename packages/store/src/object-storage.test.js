import {
  HeadBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { mainTestFn, test } from "@compas/cli";
import { isNil, isProduction, streamToBuffer, uuid } from "@compas/stdlib";
import {
  objectStorageCreateClient,
  objectStorageEnsureBucket,
  objectStorageGetDevelopmentConfig,
  objectStorageGetObjectStream,
  objectStorageListObjects,
  objectStorageRemoveBucket,
} from "./object-storage.js";

mainTestFn(import.meta);

test("store/object-storage", (t) => {
  // TODO: appError format of an S3 error...

  t.test("objectStorageGetDevelopmentConfig", (t) => {
    const config = objectStorageGetDevelopmentConfig();
    const secondConfig = objectStorageGetDevelopmentConfig();

    t.deepEqual(config, secondConfig);
  });

  t.test("objectStorageCreateClient", (t) => {
    const client = objectStorageCreateClient(
      objectStorageGetDevelopmentConfig(),
    );

    t.ok(client);
  });

  t.test("objectStorageEnsureBucket", (t) => {
    const bucketName = uuid();

    t.test("bucketName is required", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      try {
        await objectStorageEnsureBucket(client, {});
      } catch (e) {
        t.ok(e.info.message.includes("required"));
      }
    });

    t.test("bucket is created", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      const headCommandResult = await client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
      );
      t.equal(headCommandResult.$metadata.httpStatusCode, 200);
    });

    t.test("bucket is created - with location", async (t) => {
      const bucketName = uuid();
      const location = "eu-central-1";

      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      await objectStorageEnsureBucket(client, {
        bucketName,
        locationConstraint: location,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      const headCommandResult = await client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
      );
      t.equal(headCommandResult.$metadata.httpStatusCode, 200);
    });

    t.test("bucket exists", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      const headCommandResult = await client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
      );
      t.equal(headCommandResult.$metadata.httpStatusCode, 200);
    });
  });

  t.test("objectStorageRemoveBucket", (t) => {
    t.test("bucketName is required", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      try {
        await objectStorageRemoveBucket(client, {});
      } catch (e) {
        t.ok(e.info.message.includes("required"));
      }
    });

    t.test("empty bucket", async (t) => {
      const bucketName = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });
      await objectStorageRemoveBucket(client, {
        bucketName,
      });

      const listBucketsResult = await client.send(new ListBucketsCommand({}));

      t.ok(
        isNil(listBucketsResult.Buckets.find((it) => it.Name === bucketName)),
      );
    });

    t.test("bucket not empty error", async (t) => {
      const bucketName = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: uuid(),
          Body: Buffer.from("foo"),
          ContentType: "text/plain",
        }),
      );

      try {
        await objectStorageRemoveBucket(client, {
          bucketName,
        });
      } catch (e) {
        t.equal(e.name, "BucketNotEmpty");
      }
    });

    t.test("bucket not empty - delete all objects", async (t) => {
      const bucketName = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: uuid(),
          Body: Buffer.from("foo"),
          ContentType: "text/plain",
        }),
      );

      await objectStorageRemoveBucket(client, {
        bucketName,
        includeAllObjects: true,
      });

      const listBucketsResult = await client.send(new ListBucketsCommand({}));

      t.ok(
        isNil(listBucketsResult.Buckets.find((it) => it.Name === bucketName)),
      );
    });
  });

  t.test("objectStorageListObjects", (t) => {
    t.test("bucketName is required", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      try {
        await objectStorageListObjects(client, {});
      } catch (e) {
        t.ok(e.info.message.includes("required"));
      }
    });

    t.test("iterator is returned", async (t) => {
      const bucketName = uuid();
      const objectKey = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: Buffer.from("foo"),
          ContentType: "text/plain",
        }),
      );

      for await (const result of objectStorageListObjects(client, {
        bucketName,
      })) {
        t.equal(result.Contents[0].Key, objectKey);
      }
    });
  });

  t.test("objectStorageGetObjectStream", (t) => {
    t.test("bucketName is required", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      try {
        await objectStorageGetObjectStream(client, {});
      } catch (e) {
        t.ok(e.info.message.includes("required"));
      }
    });

    t.test("objectKey is required", async (t) => {
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );

      try {
        await objectStorageGetObjectStream(client, {
          bucketName: uuid(),
        });
      } catch (e) {
        t.ok(e.info.message.includes("required"));
      }
    });

    t.test("success", async (t) => {
      const bucketName = uuid();
      const objectKey = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: Buffer.from("foo"),
          ContentType: "text/plain",
        }),
      );

      const buffer = await streamToBuffer(
        await objectStorageGetObjectStream(client, {
          bucketName,
          objectKey,
        }),
      );

      t.equal(buffer.toString("utf-8"), "foo");
    });

    t.test("success - with range", async (t) => {
      const bucketName = uuid();
      const objectKey = uuid();
      const client = objectStorageCreateClient(
        objectStorageGetDevelopmentConfig(),
      );
      await objectStorageEnsureBucket(client, {
        bucketName,
        createBucketOverrides:
          !isProduction() ?
            {
              // Versitygw doesn't support bucket ACLs
              ACL: undefined,
            }
          : {},
      });

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: Buffer.from("foo"),
          ContentType: "text/plain",
        }),
      );

      const buffer = await streamToBuffer(
        await objectStorageGetObjectStream(client, {
          bucketName,
          objectKey,
          range: {
            start: 0,
            end: 1,
          },
        }),
      );

      t.equal(buffer.toString("utf-8"), "fo");
    });
  });
});
