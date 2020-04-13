import { isNil } from "@lbu/stdlib";

export function referenceMock(mock, { ignoreDefaults }) {
  const result = [];

  const fn = `mock${mock.referenceModel}`;
  if (ignoreDefaults) {
    result.push(`${fn}_Optional()`);
  } else {
    result.push(`${fn}()`);
  }

  if (mock.isOptional) {
    if (!isNil(mock.defaultValue) && !ignoreDefaults) {
      result.push(mock.defaultValue);
    } else {
      result.push("undefined");
    }
  }

  if (result.length === 1) {
    return result[0];
  } else {
    return `_mocker.pickone([${result.join(", ")}])`;
  }
}
