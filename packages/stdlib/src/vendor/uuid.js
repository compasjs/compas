/*
 The MIT License (MIT)

 Copyright (c) 2010-2020 Robert Kieffer and other contributors

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

// From: https://github.com/uuidjs/uuid/tree/a21e4d8c539bd7bfad29e360ab69766f941667b6

import { randomFillSync } from "crypto";

const randomPool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = randomPool.length;
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 *
 * @param buf
 * @param offset
 */
function bytesToUuid(buf, offset) {
  const i = offset || 0;

  const bth = byteToHex;

  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return `${
    bth[buf[i + 0]] + bth[buf[i + 1]] + bth[buf[i + 2]] + bth[buf[i + 3]]
  }-${bth[buf[i + 4]]}${bth[buf[i + 5]]}-${bth[buf[i + 6]]}${bth[buf[i + 7]]}-${
    bth[buf[i + 8]]
  }${bth[buf[i + 9]]}-${bth[buf[i + 10]]}${bth[buf[i + 11]]}${
    bth[buf[i + 12]]
  }${bth[buf[i + 13]]}${bth[buf[i + 14]]}${bth[buf[i + 15]]}`.toLowerCase();
}

/**
 *
 */
export function v4() {
  if (poolPtr > randomPool.length - 16) {
    randomFillSync(randomPool);
    poolPtr = 0;
  }
  const buffer = randomPool.slice(poolPtr, (poolPtr += 16));

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;

  return bytesToUuid(buffer);
}
