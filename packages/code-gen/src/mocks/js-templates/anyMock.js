import { isNil } from "@lbu/stdlib";

export function anyMock(mock, { ignoreDefaults }) {
  const result = [];

  // TODO: Lots of missing cases, decide on stuff ?
  //  OR force a custom provided mock?
  if (mock.typeOf) {
    switch (mock.typeOf) {
      case "boolean":
        result.push("_mocker.bool()");
        break;
      case "number":
        result.push("_mocker.float()");
        break;
      case "string":
        result.push("_mocker.string()");
        break;
    }
  }

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
