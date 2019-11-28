import { v4 } from "uuid";

/**
 * Generate v4 UUID's
 */
export const uuid = v4;

/**
 * Emulate a RingBuffer
 * It provides an Iterator for the underlying array instead of starting at the current position
 *
 * @example  The average response time of the last 4 requests
 * const responseTimes = new RingBuffer<number>(4);
 * responseTimes.value = 35;
 * responseTimes.next().value = 27;
 * responseTimes.next().value = 11;
 * responseTimes.next().value = 15;
 * responseTimes.next().value = 99;
 * responseTimes.next().value = 21;
 * responseTimes.next().value = 34;
 * responseTimes.next().value = 39;
 *
 * let sum = 0;
 * for (const time of responseTimes) { sum += time }
 * console.log("Last avg:", sum / responseTimes.length()
 */
export class RingBuffer<T> {
  private items: T[];
  private currentIndex = 0;

  /**
   *
   * @param size Size of the RingBuffer. Not that this is static
   */
  constructor(private size: number) {
    this.items = [];
    this.items.length = size;
  }

  length() {
    return this.size;
  }

  /**
   * Move `steps` in to any direction
   * Both backward and forward moves are allowed. If steps + current state is bigger than size
   * or below 0, it will wrap around
   * @param steps
   */
  move(steps: number): RingBuffer<T> {
    const realSteps = steps % this.size;
    this.currentIndex += realSteps;
    this.wrapCurrentIndex();

    return this;
  }

  /**
   * Move the 'pointer' one step forward
   * @see move(1)
   */
  next(): RingBuffer<T> {
    return this.move(1);
  }

  /**
   * Go to the specified index
   * If index is bigger than size or below 0, it will wrap around
   * @param index
   */
  to(index: number): RingBuffer<T> {
    this.currentIndex = index;
    this.wrapCurrentIndex();

    return this;
  }

  /**
   * Get the value at the current location
   */
  get value(): T {
    return this.items[this.currentIndex];
  }

  /**
   * Set value at the current location
   * @param item
   */
  set value(item: T) {
    this.items[this.currentIndex] = item;
  }

  private wrapCurrentIndex() {
    if (this.currentIndex > this.size - 1) {
      this.currentIndex -= this.size;
      this.wrapCurrentIndex();
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.size + this.currentIndex;
      this.wrapCurrentIndex();
    }
  }

  /**
   * Provide the iterator for the underlying array
   */
  [Symbol.iterator](): IterableIterator<T> {
    return this.items.values();
  }
}
