import { Config, CONFIG } from "./config";
import { PG, Postgres } from "./pg";
import {
  get as containerGet,
  getAsync as containerGetAsync,
} from "./service-locator";

export interface Container {
  [CONFIG]: Config<any>;
  [PG]: Postgres;
}

export function get<K extends keyof Container>(key: K) {
  return containerGet<Container, K>(key);
}

export async function getAsync<K extends keyof Container>(key: K) {
  return containerGetAsync<Container, K>(key);
}
