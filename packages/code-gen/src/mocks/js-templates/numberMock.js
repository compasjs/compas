export const numberMock = (mock, { ignoreDefaults }) => {
  const result = [];
  const mockArgs = JSON.stringify({
    min: mock.validator.min,
    max: mock.validator.max,
    fixed: 3,
  });

  if (mock.oneOf !== undefined) {
    result.push(...mock.oneOf);
  } else if (mock.validator.integer) {
    result.push(`_mocker.integer(${mockArgs})`);
  } else {
    result.push(`_mocker.integer(${mockArgs})`);
    result.push(`_mocker.floating(${mockArgs})`);
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
};
