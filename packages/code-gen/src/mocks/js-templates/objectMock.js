import { isNil } from "@lbu/stdlib";
import { mockForType } from "./mockForType.js";

export function objectMock(mock, { ignoreDefaults }) {
  const result = [];

  let buildObject = `{`;
  for (const key of Object.keys(mock.keys)) {
    buildObject += `${key}: ${mockForType(mock.keys[key], {
      ignoreDefaults,
    })},`;
  }
  buildObject += "}";
  result.push(buildObject);

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
