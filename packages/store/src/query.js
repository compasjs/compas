/**
 * @name QueryPart
 * @typedef {object}
 * @property {string[]} strings
 * @property {*[]} values
 * @property {function(QueryPart): QueryPart} append
 * @property {function(Postgres): postgres.PendingQuery} exec
 */

/**
 * Format and append query parts, and exec the final result in a safe way.
 * Undefined values are skipped, as they are not allowed in queries.
 *
 * @param {string[]} strings
 * @param {...*} values
 * @returns {QueryPart}
 */
export function query(strings, ...values) {
  let _strings = [];
  const _values = [];

  const result = {
    get strings() {
      return _strings;
    },
    get values() {
      return _values;
    },
    append: append.bind(this),
    exec: exec.bind(this),
  };

  // Flatten nested query parts
  let didFlatten = false;
  for (let i = 0; i < strings.length - 1; ++i) {
    if (didFlatten) {
      didFlatten = false;
      _strings[_strings.length - 1] += strings[i];
    } else {
      _strings.push(strings[i]);
    }
    if (Array.isArray(values[i]?.strings) && Array.isArray(values[i]?.values)) {
      append(values[i]);
      didFlatten = true;
    } else {
      _values.push(values[i]);
    }
  }

  if (didFlatten) {
    _strings[_strings.length - 1] += strings[strings.length - 1];
  } else {
    _strings.push(strings[strings.length - 1]);
  }

  return result;

  function append(query) {
    const last = _strings[_strings.length - 1];
    const [first, ...rest] = query.strings;
    _strings = [..._strings.slice(0, -1), `${last} ${first}`, ...rest];
    _values.push.apply(_values, query.values);
    return result;
  }

  function exec(sql) {
    let str = _strings[0];
    let valueIdx = 1;
    for (let i = 0; i < _values.length; ++i) {
      if (_values[i] === undefined) {
        str += `${_strings[i + 1]}`;
      } else {
        str += `$${valueIdx++}${_strings[i + 1]}`;
      }
    }

    // Strip out undefined values
    return sql.unsafe(
      str,
      _values.filter((it) => it !== undefined),
    );
  }
}
