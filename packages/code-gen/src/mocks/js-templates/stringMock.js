export function stringMock(mock, { ignoreDefaults }) {
  const result = [];
  const mockArgs = JSON.stringify({
    min: mock.validator.min,
    max: mock.validator.max,
    casing: mock.validator.upperCase
      ? "upper"
      : mock.validator.lowerCase
      ? "lower"
      : undefined,
    alpha: true,
  });

  if (mock.oneOf !== undefined) {
    for (const str of mock.oneOf) {
      result.push(`"${str}"`);
    }
  } else {
    result.push(`_mocker.string(${mockArgs})`);
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
