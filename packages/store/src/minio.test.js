import { mainTestFn, test } from "@lbu/cli";
import { uuid } from "@lbu/stdlib";
import { ensureBucket, newMinioClient, removeBucket } from "./minio.js";

mainTestFn(import.meta);

test("store/minio", (t) => {
  const client = newMinioClient({});
  const bucketName = uuid();
  const region = "us-east-1";

  t.test("creating a bucket", async () => {
    await ensureBucket(client, bucketName, region);
    // doesn't throw because bucket exists, else should throw for not providing a region
    await ensureBucket(client, bucketName);
  });

  t.test("deleting a bucket", async () => {
    await removeBucket(client, bucketName);
  });
});
