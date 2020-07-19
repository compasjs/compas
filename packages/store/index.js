import { dirnameForModule } from "@lbu/stdlib";

export {
  newMinioClient,
  minio,
  ensureBucket,
  removeBucket,
  listObjects,
  removeBucketAndObjectsInBucket,
} from "./src/minio.js";

export { newPostgresConnection, postgres } from "./src/postgres.js";

export {
  cleanupTestPostgresDatabase,
  createTestPostgresDatabase,
} from "./src/testing.js";

export {
  newMigrateContext,
  getMigrationsToBeApplied,
  runMigrations,
} from "./src/migrations.js";

export {
  createOrUpdateFile,
  copyFile,
  getFileById,
  getFileStream,
  newFileStoreContext,
  deleteFile,
  syncDeletedFiles,
} from "./src/files.js";

export { FileCache } from "./src/file-cache.js";

export { JobQueueWorker, addJobToQueue } from "./src/queue.js";

export { newSessionStore } from "./src/sessions.js";

export const migrations = `${dirnameForModule(import.meta)}/migrations`;
export { structure as storeStructure } from "./src/generated/structure.js";
