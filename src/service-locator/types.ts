export type InternalService = Service<any> | AsyncService<any>;

export type ExtractReturnType<T> = T extends Service<infer Return1>
  ? Return1
  : T extends AsyncService<infer Return2>
  ? Return2
  : never;

export abstract class Service<T> {
  value?: T;

  abstract init(): T;
  abstract dispose(value: T): void;
}

export abstract class AsyncService<T> {
  value?: T;

  abstract async init(): Promise<T>;
  abstract async dispose(value: T): Promise<void>;
}
