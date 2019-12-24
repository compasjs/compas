import "jest";
import { RingBuffer, uuid } from "./datastructures";

test("unique uuid for every call", () => {
  expect(uuid()).not.toBe(uuid());
  expect(uuid()).not.toBe(uuid());
  expect(uuid()).not.toBe(uuid());
});

describe("RingBuffer", () => {
  const generateNewRingBuffer = () => {
    const r = new RingBuffer<number>(5);
    r.value = 0;
    r.next().value = 1;
    r.next().value = 2;
    r.next().value = 3;
    r.next().value = 4;
    r.next();

    return r;
  };

  test("Provided size should equal length", () => {
    expect(new RingBuffer(5).length()).toBe(5);
  });

  test("move() should wrap around", () => {
    expect(generateNewRingBuffer().move(3).value).toBe(3);
    expect(generateNewRingBuffer().move(-3).value).toBe(2);
    expect(generateNewRingBuffer().move(7).value).toBe(2);
    expect(generateNewRingBuffer().move(-7).value).toBe(3);
  });

  test("next() should move forward and wrap around", () => {
    const r = generateNewRingBuffer();
    expect(r.value).toBe(0);

    r.next();
    expect(r.value).toBe(1);

    r.next()
      .next()
      .next()
      .next()
      .next();
    expect(r.value).toBe(1);
  });

  test("to() should jump correctly and wrap if necessary", () => {
    const r = generateNewRingBuffer();
    expect(r.to(3).value).toBe(3);
    expect(r.to(-1).value).toBe(4);
    expect(r.to(-2).value).toBe(3);
    expect(r.to(0).value).toBe(0);
  });

  test("initial values are undefined", () => {
    const r = new RingBuffer<number>(5);
    for (const i of r) {
      expect(i).toBeUndefined();
    }
  });
});
