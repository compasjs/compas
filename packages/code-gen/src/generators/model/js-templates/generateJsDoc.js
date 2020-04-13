import { isNil } from "@lbu/stdlib";

export function generateJsDoc(models, value, { ignoreDefaults }) {
  let result = "";
  switch (value.type) {
    case "boolean":
      if (value.convert) {
        result += '"true"|"false"|true|false|0|1';
      } else if (value.oneOf) {
        result += value.oneOf;
      } else {
        result += "boolean";
      }
      break;
    case "number":
      if (value.oneOf) {
        result += '"' + value.oneOf.join('"|"') + '"';
      } else {
        result += "number";
      }
      break;
    case "string":
      if (value.oneOf) {
        result += value.oneOf.map((it) => `"${it}"`).join("|");
      } else {
        result += "string";
      }
      break;
    case "object":
      result += "{";
      result += Object.entries(value.keys)
        .map(([k, v]) => {
          let rightSide = generateJsDoc(models, v, { ignoreDefaults }).trim();
          let separator = ": ";
          if (rightSide.endsWith("|undefined")) {
            rightSide = rightSide.substring(0, rightSide.length - 10);
            separator = "?: ";
          }
          return k + separator + rightSide;
        })
        .join(", ");
      result += "}";
      break;
    case "array": {
      const docType = generateJsDoc(models, value.values, {
        ignoreDefaults,
      }).trim();
      if (value.convert) {
        result += docType + "|";
      }
      result += docType + "[]";

      break;
    }
    case "anyOf":
      result += "(";
      result += value.values
        .map((value) => generateJsDoc(models, value, { ignoreDefaults }).trim())
        .join("|");
      result += ")";
      break;
    case "reference":
      if (!isNil(value.referenceField)) {
        const refModel = models[value.referenceModel];
        result += generateJsDoc(models, refModel.keys[value.referenceField], {
          ignoreDefaults,
        });
      } else {
        result += value.referenceModel;
      }
      break;
    case "any":
      result += "*";
      break;
    case "generic":
      result += "Object.<";
      result += generateJsDoc(models, value.keys, { ignoreDefaults });
      result += ",";
      result += generateJsDoc(models, value.values, { ignoreDefaults });
      result += ">";
      break;
  }

  if (ignoreDefaults) {
    if (value.isOptional) {
      result += "|undefined";
    }
  } else {
    // If default !== undefined, the value returned from validator will be set
    if (value.isOptional && value.defaultValue === undefined) {
      result += "|undefined";
    }
  }

  return result;
}
