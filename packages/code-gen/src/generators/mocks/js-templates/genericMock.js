import { isNil } from "@lbu/stdlib";
import { mockForType } from "./mockForType.js";

export function genericMock(mock, { ignoreDefaults }) {
  const result = [];

  const entryMock = mockForType(
    {
      type: "array",
      validator: {
        min: 2,
      },
      values: {
        mocks: {
          rawMock: `[${mockForType(mock.keys, {
            ignoreDefaults,
          })}, ${mockForType(mock.values, { ignoreDefaults })}]`,
        },
      },
    },
    { ignoreDefaults },
  );

  result.push(`Object.fromEntries(${entryMock})`);

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
