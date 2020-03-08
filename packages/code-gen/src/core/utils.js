export const generateJsDoc = ({ models, useDefault, value }) => {
  let result = "";
  if (value.type === "boolean") {
    result += "boolean";
  } else if (value.type === "number") {
    result += "number";
  } else if (value.type === "string") {
    result += "string";
  } else if (value.type === "object") {
    result += "{";
    result += Object.entries(value.keys)
      .map(
        ([k, v]) =>
          k + ": " + generateJsDoc({ models, useDefault, value: v }).trim(),
      )
      .join(", ");
    result += "}";
  } else if (value.type === "array") {
    result +=
      generateJsDoc({ models, useDefault, value: value.values }).trim() + "[]";
  } else if (value.type === "anyOf") {
    result += "(";
    result += value.values
      .map(value => generateJsDoc({ models, useDefault, value }).trim())
      .join("|");
    result += ")";
  } else if (value.type === "reference") {
    result += generateJsDoc({
      models,
      useDefault,
      value: models[value.referenceModel],
    });
  } else if (value.type === "any") {
    result += "*";
  } else if (value.type === "generic") {
    result += "Object.<";
    result += generateJsDoc({ models, useDefault, value: models[value.keys] });
    result += ",";
    result += generateJsDoc({
      models,
      useDefault,
      value: models[value.values],
    });
    result += ">";
  }

  if (useDefault) {
    if (value.optional && value.default === undefined) {
      result += "|undefined";
    }
  } else {
    if (value.optional) {
      result += "|undefined";
    }
  }

  return result;
};
