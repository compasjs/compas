import { mockForType } from "./mockForType.js";

export function anyOfMock(mock, { ignoreDefaults }) {
  const result = [];

  for (const value of mock.values) {
    result.push(mockForType(value, { ignoreDefaults }));
  }

  if (mock.optional) {
    if (mock.default && !ignoreDefaults) {
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
