import "jest";
import { dispose, get, getAsync, register } from "../service-locator";
import { AsyncService, Service } from "../types";

const constrMock = jest.fn();
const initMock = jest.fn();
const disposeMock = jest.fn();

beforeEach(async () => {
  await dispose();
  constrMock.mockClear();
  initMock.mockClear();
  disposeMock.mockClear();
});

class TestService extends Service<any> {
  static readonly symbol: unique symbol = Symbol.for("testService");

  constructor() {
    super();
    constrMock();
  }

  public dispose(arg: any): void {
    disposeMock(arg);
    return;
  }

  public init(): any {
    initMock();
    return {};
  }
}

class AsyncTestService extends AsyncService<any> {
  static readonly symbol: unique symbol = Symbol.for("asyncTestService");

  constructor() {
    super();
    constrMock();
  }

  public async dispose(arg: any): Promise<void> {
    disposeMock(arg);
    return;
  }

  public async init(): Promise<any> {
    initMock();
    return {};
  }
}

test("register disposes item when registering again", () => {
  register(TestService.symbol, new TestService());
  expect(constrMock).toHaveBeenCalledTimes(1);
  // not initialized
  expect(disposeMock).toHaveBeenCalledTimes(0);
  get<{ [TestService.symbol]: TestService }, any>(TestService.symbol);

  register(TestService.symbol, new TestService());
  expect(constrMock).toHaveBeenCalledTimes(2);
  expect(disposeMock).toHaveBeenCalledTimes(1);
});

test("get calls init only the first time", () => {
  register(TestService.symbol, new TestService());
  const return1 = get<{ [TestService.symbol]: TestService }, any>(
    TestService.symbol,
  );
  const return2 = get<{ [TestService.symbol]: TestService }, any>(
    TestService.symbol,
  );

  expect(return1 === return2);
  expect(initMock).toHaveBeenCalledTimes(1);
});

test("get throws when not registered", () => {
  expect(() =>
    get<{ [TestService.symbol]: TestService }, any>(TestService.symbol),
  ).toThrow();
});

test("get throws when first time get for async service", () => {
  register(AsyncTestService.symbol, new AsyncTestService());
  expect(() =>
    get<{ [AsyncTestService.symbol]: AsyncTestService }, any>(
      AsyncTestService.symbol,
    ),
  ).toThrow();
});

test("getAsync throws when not registered", async () => {
  expect.assertions(1);
  try {
    await getAsync<{ [AsyncTestService.symbol]: AsyncTestService }, any>(
      AsyncTestService.symbol,
    );
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

test("getAsync returns consistent result", async () => {
  register(AsyncTestService.symbol, new AsyncTestService());

  const res1 = await getAsync<
    { [AsyncTestService.symbol]: AsyncTestService },
    any
  >(AsyncTestService.symbol);

  const res2 = await getAsync<
    { [AsyncTestService.symbol]: AsyncTestService },
    any
  >(AsyncTestService.symbol);

  expect(res1 === res2);
  expect(initMock).toHaveBeenCalledTimes(1);
});

test("getAsync works also fine for sync services", async () => {
  register(TestService.symbol, new TestService());

  const res1 = await getAsync<{ [TestService.symbol]: TestService }, any>(
    TestService.symbol,
  );

  const res2 = await getAsync<{ [TestService.symbol]: TestService }, any>(
    TestService.symbol,
  );

  expect(res1 === res2);
  expect(initMock).toHaveBeenCalledTimes(1);
});
