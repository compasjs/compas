import { createReadStream } from "fs";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { mainTestFn, newTestEvent, test } from "@compas/cli";
import {
  AppError,
  filenameForModule,
  streamToBuffer,
  uuid,
} from "@compas/stdlib";
import { decode } from "jws";
import { s3Client, sql, testBucketName } from "../../../src/testing.js";
import {
  fileCreateOrUpdate,
  fileFormatMetadata,
  fileTransformInPlace,
  fileSignAccessToken,
  fileSyncDeletedWithObjectStorage,
  fileVerifyAccessToken,
} from "./file.js";
import { queryJob } from "./generated/database/job.js";
import { validateStoreFileResponse } from "./generated/store/validators.js";
import { queries } from "./generated.js";
import { objectStorageGetObjectStream } from "./object-storage.js";
import { query } from "./query.js";

mainTestFn(import.meta);

test("store/file", (t) => {
  const imagePath = "./docs/public/favicon/favicon-16x16.png";

  t.test("fileCreateOrUpdateFile", (t) => {
    t.test("validator props.name", async (t) => {
      try {
        await fileCreateOrUpdate(
          sql,
          s3Client,
          {
            bucketName: testBucketName,
          },
          {},
          "",
        );
      } catch (e) {
        t.equal(e.key, `file.createOrUpdate.invalidName`);
      }
    });

    t.test("validator source", async (t) => {
      try {
        await fileCreateOrUpdate(
          sql,
          s3Client,
          {
            bucketName: testBucketName,
          },
          {
            name: "foo.txt",
          },
        );
      } catch (e) {
        t.equal(e.key, `file.createOrUpdate.missingSource`);
      }
    });

    t.test("create", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          name: "foo.txt",
        },
        Buffer.from("foo"),
      );

      const buffer = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: testBucketName,
          objectKey: file.id,
        }),
      );

      t.equal(buffer.toString("utf-8"), "foo");
    });

    t.test("create with id", async (t) => {
      const id = uuid();

      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          id,
          name: "foo.txt",
        },
        Buffer.from("foo"),
      );

      t.equal(file.id, id);
    });

    t.test("update", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          name: "foo.txt",
        },
        Buffer.from("foo"),
      );

      await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          id: file.id,
          name: "foo.txt",
        },
        Buffer.from("updated"),
      );

      const buffer = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: testBucketName,
          objectKey: file.id,
        }),
      );

      t.equal(buffer.toString("utf-8"), "updated");
    });

    t.test("source type file path", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          name: "file.test.js",
        },
        filenameForModule(import.meta),
      );

      t.equal(file.contentType, "application/javascript");
      t.ok(file.contentLength > 100);
    });

    t.test("source type stream", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },
        {
          name: "file.test.js",
        },
        createReadStream(filenameForModule(import.meta)),
      );

      t.equal(file.contentType, "application/javascript");
      t.ok(file.contentLength > 100);
    });

    t.test("allowedContentTypes", (t) => {
      t.test("fail", async (t) => {
        try {
          await fileCreateOrUpdate(
            sql,
            s3Client,
            {
              bucketName: testBucketName,
              allowedContentTypes: ["image/jpeg"],
            },
            {
              name: "image.jpg",
            },
            imagePath,
          );
        } catch (e) {
          t.equal(e.key, "file.createOrUpdate.invalidContentType");
        }
      });

      t.test("succes", async (t) => {
        const file = await fileCreateOrUpdate(
          sql,
          s3Client,
          {
            bucketName: testBucketName,
            allowedContentTypes: ["image/png"],
          },
          {
            name: "image.png",
          },
          imagePath,
        );

        t.equal(file.contentType, "image/png");
      });
    });

    t.test("schedulePlaceholderImageJob", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
          allowedContentTypes: ["image/png"],
          schedulePlaceholderImageJob: true,
        },
        {
          name: "image.png",
        },
        imagePath,
      );

      const [job] = await queryJob({
        where: {
          isComplete: false,
          $raw: query`data->>'fileId' =
                                         ${file.id}`,
        },
      }).exec(sql);

      t.equal(job.name, "compas.file.generatePlaceholderImage");
    });
  });

  t.test("fileTransformInPlace", (t) => {
    t.test("rotate", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
          allowedContentTypes: ["image/png"],
          schedulePlaceholderImageJob: true,
        },
        {
          name: "image.png",
        },
        imagePath,
      );

      const originalFile = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: file.bucketName,
          objectKey: file.id,
        }),
      );

      await fileTransformInPlace(newTestEvent(t), sql, s3Client, file, {
        rotate: 90,
      });

      const updatedFile = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: file.bucketName,
          objectKey: file.id,
        }),
      );

      t.notEqual(originalFile.toString("hex"), updatedFile.toString("hex"));
    });

    t.test("stripMetadata", async (t) => {
      const file = await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
          allowedContentTypes: ["image/png"],
          schedulePlaceholderImageJob: true,
        },
        {
          name: "image.png",
        },
        imagePath,
      );

      const originalFile = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: file.bucketName,
          objectKey: file.id,
        }),
      );

      await fileTransformInPlace(newTestEvent(t), sql, s3Client, file, {
        stripMetadata: true,
      });

      const updatedFile = await streamToBuffer(
        await objectStorageGetObjectStream(s3Client, {
          bucketName: file.bucketName,
          objectKey: file.id,
        }),
      );

      t.notEqual(originalFile.toString("hex"), updatedFile.toString("hex"));
    });
  });

  t.test("fileSyncDeletedWithObjectStorage", (t) => {
    const id = uuid();

    t.test("setup", async (t) => {
      await fileCreateOrUpdate(
        sql,
        s3Client,
        {
          bucketName: testBucketName,
        },

        {
          id,
          name: "image.png",
        },
        imagePath,
      );

      await queries.fileDelete(sql, {
        id,
      });

      t.pass();
    });

    t.test("run", async (t) => {
      await fileSyncDeletedWithObjectStorage(sql, s3Client, {
        bucketName: testBucketName,
      });

      try {
        await s3Client.send(
          new HeadObjectCommand({
            Key: id,
            Bucket: testBucketName,
          }),
        );
      } catch (e) {
        t.equal(e.name, "NotFound");
      }
    });
  });

  t.test("fileFormatMetadata", (t) => {
    t.test("url is required", (t) => {
      try {
        fileFormatMetadata({}, {});
      } catch (e) {
        t.ok(e.info.message.includes("requires that the url"));
      }
    });

    t.test("success", (t) => {
      const result = fileFormatMetadata(
        {
          id: uuid(),
          name: "foo.txt",
          contentType: "image/png",
          meta: {
            altText: "hi",
          },
        },
        {
          url: "http://localhost:8080",
        },
      );

      const validateResult = validateStoreFileResponse(result);

      t.ok(validateResult.value);
      t.equal(result.altText, "hi");
      t.equal(result.name, "foo.txt");
    });
  });

  t.test("fileSignAccessToken", (t) => {
    t.test("all options are mandatory", (t) => {
      try {
        fileSignAccessToken({
          fileId: uuid(),
          signingKey: 5,
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 500);
      }

      try {
        fileSignAccessToken({
          signingKey: uuid(),
          maxAgeInSeconds: 5,
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 500);
      }
    });

    t.test("returns string", (t) => {
      const result = fileSignAccessToken({
        fileId: uuid(),
        signingKey: uuid(),
        maxAgeInSeconds: 5,
      });

      const decoded = decode(result);

      t.equal(typeof result, "string");
      t.ok(uuid.isValid(decoded.payload.fileId));
    });
  });

  t.test("fileVerifyAccessToken", (t) => {
    t.test("all options are mandatory", (t) => {
      try {
        fileVerifyAccessToken({
          fileAccessToken: uuid(),
          expectedFileId: uuid(),
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 500);
      }

      try {
        fileVerifyAccessToken({
          signingKey: uuid(),
        });
      } catch (e) {
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 500);
      }
    });

    t.test("handles unknown signingKey", (t) => {
      const accessToken = fileSignAccessToken({
        fileId: uuid(),
        signingKey: uuid(),
        maxAgeInSeconds: 5,
      });

      try {
        fileVerifyAccessToken({
          fileAccessToken: accessToken,
          signingKey: uuid(),
          expectedFileId: uuid(),
        });
      } catch (e) {
        t.equal(typeof accessToken, "string");
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 400);
        t.ok(e.key.includes("invalidToken"));
      }
    });

    t.test("handles expired token", (t) => {
      const signingKey = uuid();
      const accessToken = fileSignAccessToken({
        fileId: uuid(),
        signingKey,
        maxAgeInSeconds: -5,
      });

      try {
        fileVerifyAccessToken({
          fileAccessToken: accessToken,
          signingKey,
          expectedFileId: uuid(),
        });
      } catch (e) {
        t.equal(typeof accessToken, "string");
        t.ok(AppError.instanceOf(e));
        t.equal(e.status, 400);
        t.ok(e.key.includes("expiredToken"));
      }
    });

    t.test("incorrect file id", (t) => {
      const fileId = uuid();
      const signingKey = uuid();
      const accessToken = fileSignAccessToken({
        fileId,
        signingKey,
        maxAgeInSeconds: 5,
      });

      try {
        fileVerifyAccessToken({
          fileAccessToken: accessToken,
          signingKey,
          expectedFileId: uuid(),
        });
      } catch (e) {
        t.equal(e.status, 400);
        t.ok(e.key.includes("invalidToken"));
      }

      t.pass();
    });

    t.test("success", (t) => {
      const fileId = uuid();
      const signingKey = uuid();
      const accessToken = fileSignAccessToken({
        fileId,
        signingKey,
        maxAgeInSeconds: 5,
      });

      fileVerifyAccessToken({
        fileAccessToken: accessToken,
        signingKey,
        expectedFileId: fileId,
      });

      t.pass();
    });
  });
});
