import { addTypeFilter, Logger } from "@lightbase/insight";
import { isNil } from "@lightbase/stdlib";
import { AsyncService, ExtractReturnType, InternalService } from "./types";

const logType = "SERVICE_LOCATOR";
addTypeFilter(logType);

const logger = new Logger(5, { type: logType });
const registry = new Map<symbol, InternalService>();

export async function dispose() {
  logger.info("dispose");

  for (const key of registry.keys()) {
    const value = registry.get(key);
    registry.delete(key);
    await disposeValue(key, value!);
  }

  registry.clear();
}

export function disposeValue(
  key: symbol,
  value: InternalService,
): void | Promise<void> {
  logger.info("disposing value", { description: key.description });
  if (isNil(value.value)) {
    return;
  }

  if (value instanceof AsyncService) {
    return value.dispose(value.value);
  } else {
    return value.dispose(value.value);
  }
}

/**
 * Note: When overwriting a key that is an AsyncService, there may be a period of 2 instances
 * being 'active'
 */
export function register(
  key: symbol,
  instance: InternalService,
): void | Promise<void> {
  logger.info("register", { description: key.description });

  let p: Promise<any> | void = undefined;

  if (registry.has(key)) {
    p = disposeValue(key, registry.get(key)!);
  }

  if (p instanceof Promise) {
    return p.then(() => {
      registry.set(key, instance);
    });
  } else {
    registry.set(key, instance);
  }
}

export function get<ContainerType, K extends keyof ContainerType & symbol>(
  key: K,
): ExtractReturnType<ContainerType[K]> {
  logger.info("get", { description: key.description });

  if (!registry.has(key)) {
    throw new Error(`Symbol ${key.description} does not exist in the registry`);
  }

  const item = registry.get(key)!;

  if (isNil(item.value)) {
    if (item instanceof AsyncService) {
      throw new Error(
        `Symbol ${key.description} references an AsyncService. Make sure to use getAsync first.`,
      );
    } else {
      item.value = item.init();
    }
  }

  return item.value;
}

export async function getAsync<
  ContainerType,
  K extends keyof ContainerType & symbol
>(key: K): Promise<ExtractReturnType<ContainerType[K]>> {
  logger.info("getAsync", { description: key.description });

  if (!registry.has(key)) {
    throw new Error(`Symbol ${key.description} does not exist in the registry`);
  }

  const item = registry.get(key)!;

  if (isNil(item.value)) {
    if (item instanceof AsyncService) {
      item.value = await item.init();
    } else {
      item.value = item.init();
    }
  }

  return item.value;
}
