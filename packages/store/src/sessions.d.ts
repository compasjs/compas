/**
 * Create a new session store, to be used in combination with the `session` as provided
 * in `@compas/server`.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").Postgres} sql
 * @returns {SessionStore}
 */
export function newSessionStore(sql: import("../types/advanced-types").Postgres): SessionStore;
export type SessionStore = {
    get: (id: string) => Promise<object | boolean>;
    set: (id: string, session: object, age: number | "session") => Promise<void>;
    destroy: (id: string) => Promise<void>;
    clean: () => Promise<void>;
};
//# sourceMappingURL=sessions.d.ts.map