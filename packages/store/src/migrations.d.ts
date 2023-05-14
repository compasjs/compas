/**
 * @typedef {object} MigrateOptions
 * @property {string} migrationsDirectory The directory from which to read migration
 *   files
 * @property {number} uniqueLockNumber Unique migration lock value, preventing
 *   race-conditions while running the migrations
 */
/**
 * @typedef {object} MigrationFile
 * @property {number} number
 * @property {boolean} repeatable
 * @property {string} name
 * @property {string} fullPath
 * @property {boolean} isMigrated
 * @property {string} source
 * @property {string} hash
 */
/**
 * @typedef {object} MigrateContext
 * @property {MigrateOptions} options
 * @property {MigrationFile[]} files
 * @property {import("postgres").Sql<{}>} sql
 * @property {any|undefined} [rebuild]
 * @property {any|undefined} [info]
 * @property {any|undefined} [do]
 * @property {Record<number, string>} storedHashes
 * @property {boolean} [missingMigrationTable]
 */
/**
 * Create a new  migration context, resolves all migration files
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {Partial<MigrateOptions>} [migrateOptions]
 * @returns {Promise<MigrateContext>}
 */
export function migrationsInitContext(
  sql: import("postgres").Sql<{}>,
  migrateOptions?: Partial<MigrateOptions> | undefined,
): Promise<MigrateContext>;
/**
 * Get the migrations to be applied from the provided migration context.
 * Note that 'repeatable' migrations are always in both the `migrationQueue` and
 * `hashChanges`.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<{
 *   migrationQueue: {
 *     name: string,
 *     number: number,
 *     repeatable: boolean
 *   }[],
 *   hashChanges: {
 *     name: string,
 *     number: number,
 *   }[]
 * }>}
 */
export function migrationsGetInfo(mc: MigrateContext): Promise<{
  migrationQueue: {
    name: string;
    number: number;
    repeatable: boolean;
  }[];
  hashChanges: {
    name: string;
    number: number;
  }[];
}>;
/**
 * Run the migrations currently pending in the migration context.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export function migrationsRun(mc: MigrateContext): Promise<void>;
/**
 * Rebuild migration table state based on the known migration files
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export function migrationsRebuildState(mc: MigrateContext): Promise<void>;
export type MigrateOptions = {
  /**
   * The directory from which to read migration
   * files
   */
  migrationsDirectory: string;
  /**
   * Unique migration lock value, preventing
   * race-conditions while running the migrations
   */
  uniqueLockNumber: number;
};
export type MigrationFile = {
  number: number;
  repeatable: boolean;
  name: string;
  fullPath: string;
  isMigrated: boolean;
  source: string;
  hash: string;
};
export type MigrateContext = {
  options: MigrateOptions;
  files: MigrationFile[];
  sql: import("postgres").Sql<{}>;
  rebuild?: any | undefined;
  info?: any | undefined;
  do?: any | undefined;
  storedHashes: Record<number, string>;
  missingMigrationTable?: boolean | undefined;
};
//# sourceMappingURL=migrations.d.ts.map
