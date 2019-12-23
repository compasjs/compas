# Service locator

```typescript
// Creating custom service
class FooService extends Service<number> {
  // Typescript wants unique symbols when using in 'types'
  static readonly symbol: unique symbol = Symbol.for("foo");

  /// nothing to dispose
  public dispose(): void {
    return;
  }

  // fancy
  public init(): number {
    return Math.random();
  }
}

// We only need to replace init with a mock
// with more advanced setups, you may also need to override dispose
class TestFoo extends FooService {
  public init(): number {
    return Math.random();
  }
}

// All known symbols for application
type MyContainer = {
  [FooService.symbol]: FooService;
};

// Type friendly wrapper
function myGet<K extends keyof MyContainer>(key: K) {
  return get<MyContainer, K>(key);
}

register(FooService.symbol, FooService);
logger.info(myGet(FooService.symbol));

register(FooService.symbol, TestFoo);
logger.info(myGet(FooService.symbol));
logger.info(myGet(FooService.symbol));
logger.info(myGet(FooService.symbol));
logger.info(myGet(FooService.symbol));
```
