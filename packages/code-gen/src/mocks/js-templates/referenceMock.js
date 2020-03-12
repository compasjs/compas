export const referenceMock = (mock, { ignoreDefaults }) => {
  const result = [];

  const fn = `mock${mock.referenceModel}`;
  if (ignoreDefaults) {
    result.push(`${fn}_Optional()`);
  } else {
    result.push(`${fn}()`);
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
