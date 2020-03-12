export const booleanMock = (mock, { ignoreDefaults }) => {
  const result = [];

  if (mock.oneOf) {
    result.push(mock.oneOf);
  } else {
    result.push("_mocker.bool()");
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
