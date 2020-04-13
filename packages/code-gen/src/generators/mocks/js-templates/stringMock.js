import { isNil } from "@lbu/stdlib";

export function stringMock(mock, { ignoreDefaults }) {
  const result = [];
  const mockArgs = JSON.stringify({
    min: mock.validator.min,
    max: mock.validator.max,
  });

  if (mock.oneOf !== undefined) {
    for (const str of mock.oneOf) {
      result.push(`"${str}"`);
    }
  } else {
    result.push(`_mocker.word(${mockArgs})`);
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
