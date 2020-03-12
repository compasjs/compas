import { isNil } from "@lbu/stdlib";
import { anyMock } from "./anyMock.js";
import { anyOfMock } from "./anyOfMock.js";
import { arrayMock } from "./arrayMock.js";
import { booleanMock } from "./booleanMock.js";
import { genericMock } from "./genericMock.js";
import { numberMock } from "./numberMock.js";
import { objectMock } from "./objectMock.js";
import { referenceMock } from "./referenceMock.js";
import { stringMock } from "./stringMock.js";

const mapping = {
  boolean: booleanMock,
  number: numberMock,
  string: stringMock,
  object: objectMock,
  array: arrayMock,
  anyOf: anyOfMock,
  reference: referenceMock,
  any: anyMock,
  generic: genericMock,
};

export const mockForType = (mock, { ignoreDefaults }) => {
  if (!isNil(mock.mocks) && !isNil(mock.mocks.rawMock)) {
    return mock.mocks.rawMock;
  }
  const fn = mapping[mock.type];
  if (!isNil(fn)) {
    mock.validator = mock.validator || {};

    const result = fn(mock, { ignoreDefaults });
    return String(result || "").replace(/\s+/g, " ");
  }
};
