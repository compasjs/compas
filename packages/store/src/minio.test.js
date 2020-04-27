import { uuid } from "@lbu/stdlib";
import test from "tape";
import { ensureBucket, newMinioClient, removeBucket } from "./minio.js";

test("store/minio", (t) => {
  const client = newMinioClient({});
  const bucketName = uuid();
  const region = "us-east-1";

  t.test("creating a bucket", async (t) => {
    await ensureBucket(client, bucketName, region);
    // doesn't throw because bucket exists, else should throw for not providing a region
    await ensureBucket(client, bucketName);

    t.end();
  });

  t.test("deleting a bucket", async (t) => {
    await removeBucket(client, bucketName);

    t.end();
  });
});
