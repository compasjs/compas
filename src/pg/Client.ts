import { Pool } from "pg";
import { CONFIG } from "../config";
import { get } from "../container";
import { log } from "../insight";
import { register, Service } from "../service-locator";

export class Client {
  constructor(private pool: Pool) {}

  async query<T = any>(query: string, args: any[] = []): Promise<T[]> {
    query = query.replace(/\s/g, " ");
    const result = await this.pool.query(query, args);

    return result.rows;
  }

  async queryFirst<T = any>(
    query: string,
    args: any[] = [],
  ): Promise<T | undefined> {
    const [result] = await this.query<T>(query, args);
    return result;
  }

  cleanup() {
    this.pool.end().catch(err => log.error(err));
  }
}

export const PG = Symbol.for("postgres");

export class Postgres extends Service<Client> {
  init(): Client {
    const conf: any = get(CONFIG).getConfigValue("postgres")!;

    return new Client(
      new Pool({
        host: conf.host,
        query_timeout: conf.query_timeout,
        statement_timeout: conf.statement_timeout,
        connectionTimeoutMillis: conf.connectionTimeoutMillis,
        idleTimeoutMillis: conf.idleTimeoutMillis,
        max: conf.poolSize,
      }),
    );
  }

  dispose(value: Client): void {
    return value.cleanup();
  }
}

register(PG, new Postgres());
