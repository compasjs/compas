import { isNil } from "@lbu/stdlib";

export function booleanMock(mock, { ignoreDefaults }) {
  const result = [];

  if (mock.oneOf) {
    result.push(mock.oneOf);
  } else {
    result.push("_mocker.bool()");
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
