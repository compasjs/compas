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
  createFile,
  copyFile,
  getFileById,
  getFileStream,
  newFileStoreContext,
  deleteFile,
  syncDeletedFiles,
} from "./src/files.js";
export { newSessionStore } from "./src/sessions.js";

export const migrations = dirnameForModule(import.meta) + "/migrations";
