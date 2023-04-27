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
 * @property {MigrationFile[]} files
 * @property {import("postgres").Sql<{}>} sql
 * @property {any|undefined} [rebuild]
 * @property {any|undefined} [info]
 * @property {any|undefined} [do]
 * @property {Record<number, string>} storedHashes
 * @property {boolean} [missingMigrationTable]
 */
/**
 * Create a new  migration context, resolves all migrations and collects the current
 * migration state.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {string} migrationDirectory
 * @returns {Promise<MigrateContext>}
 */
export function newMigrateContext(
  sql: import("postgres").Sql<{}>,
  migrationDirectory?: string,
): Promise<MigrateContext>;
/**
 * Get the migrations to be applied from the provided migration context.
 * Note that 'repeatable' migrations are always in both the `migrationQueue` and
 * `hashChanges`.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {{
 *   migrationQueue: {
 *     name: string,
 *     number: number,
 *     repeatable: boolean
 *   }[],
 *   hashChanges: {
 *     name: string,
 *     number: number,
 *   }[]
 * }}
 */
export function getMigrationsToBeApplied(mc: MigrateContext): {
  migrationQueue: {
    name: string;
    number: number;
    repeatable: boolean;
  }[];
  hashChanges: {
    name: string;
    number: number;
  }[];
};
/**
 * Run the migrations currently pending in the migration context.
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export function runMigrations(mc: MigrateContext): Promise<void>;
/**
 * Rebuild migration table state based on the known migration files
 *
 * @since 0.1.0
 *
 * @param {MigrateContext} mc
 * @returns {Promise<void>}
 */
export function rebuildMigrations(mc: MigrateContext): Promise<void>;
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
  files: MigrationFile[];
  sql: import("postgres").Sql<{}>;
  rebuild?: any | undefined;
  info?: any | undefined;
  do?: any | undefined;
  storedHashes: Record<number, string>;
  missingMigrationTable?: boolean | undefined;
};
//# sourceMappingURL=migrations.d.ts.map
