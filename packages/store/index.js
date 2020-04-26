import { dirnameForModule } from "@lbu/stdlib";

export { newMinioClient, minio } from "./src/minio.js";
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

export const migrations = dirnameForModule(import.meta) + "/migrations";
