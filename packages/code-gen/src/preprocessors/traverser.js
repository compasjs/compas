export function traversePreprocessor(structure, callback) {
  for (const group of Object.values(structure)) {
    for (const type of Object.values(group)) {
      structure[type.group][type.name] = traverseTypePreprocessor(
        structure,
        callback,
        type,
      );
    }
  }
}

function traverseTypePreprocessor(structure, callback, type) {
  if (!type || !type.type) {
    return type;
  }

  switch (type.type) {
    case "file":
    case "any":
    case "boolean":
    case "date":
    case "number":
    case "string":
    case "uuid":
    case "reference":
      return callback(type);
    case "anyOf":
      for (let i = 0; i < type.values.length; ++i) {
        type.values[i] = traverseTypePreprocessor(
          structure,
          callback,
          type.values[i],
        );
      }
      return callback(type);
    case "array":
      type.values = traverseTypePreprocessor(structure, callback, type.values);
      return callback(type);
    case "generic":
      type.keys = traverseTypePreprocessor(structure, callback, type.keys);
      type.values = traverseTypePreprocessor(structure, callback, type.values);
      return callback(type);
    case "object":
      for (const key of Object.keys(type.keys)) {
        type.keys[key] = traverseTypePreprocessor(
          structure,
          callback,
          type.keys[key],
        );
      }
      return callback(type);
    case "omit":
    case "pick":
      type.reference = traverseTypePreprocessor(
        structure,
        callback,
        type.reference,
      );
      return callback(type);

    case "route":
      type.params = traverseTypePreprocessor(structure, callback, type.params);
      type.query = traverseTypePreprocessor(structure, callback, type.query);
      type.body = traverseTypePreprocessor(structure, callback, type.body);
      type.files = traverseTypePreprocessor(structure, callback, type.files);
      type.response = traverseTypePreprocessor(
        structure,
        callback,
        type.response,
      );

      return callback(type);
  }
}
