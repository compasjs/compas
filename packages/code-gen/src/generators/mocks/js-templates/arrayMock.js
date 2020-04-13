import { isNil } from "@lbu/stdlib";
import { mockForType } from "./mockForType.js";

export function arrayMock(mock, { ignoreDefaults }) {
  const result = [];

  const arrayFromArgs = JSON.stringify({
    min: mock.validator.min || 0,
    max: mock.validator.max || 15,
  });

  const buildArray = `Array.from({ length: _mocker.integer(${arrayFromArgs}) }, () => ${mockForType(
    mock.values,
    { ignoreDefaults },
  )})`;

  result.push(buildArray);

  if (mock.optional) {
    if (!isNil(mock.default) && !ignoreDefaults) {
      result.push(mock.default);
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
