import fs from "fs";
import path from "path";
import { isNil } from "./lodash.js";

const defaultOptions = {
  localeDir: () => path.join(process.cwd(), "locale"),
  locales: () => ["en"],
  isProduction: () => process.env.NODE_ENV === "production",
};

/**
 * Synchronously startup translate system
 * @param {Object} [options]
 * @param {string} [options.localeDir] Optional directory to use for reading locale
 *   files. Defaults to /process.cwd()/locale/
 * @param {string[]} [options.locales] List with supported locales. Defaults to ["en"]
 * @param {boolean} [options.isProduction] Determines if this will write to disk.
 *   Defaults to process.env.NODE_ENV==="production"
 */
export const newTranslator = (options = {}) => {
  const localeDir = options.localeDir || defaultOptions.localeDir();
  const locales = options.locales || defaultOptions.locales();
  const isProduction = options.isProduction || defaultOptions.isProduction();

  const localePaths = [];
  for (const locale of locales) {
    localePaths.push(path.join(localeDir, `${locale}.json`));
  }

  const data = readLocaleFiles(locales, localePaths, isProduction);
  const isDirty = syncData(data);

  if (isDirty && !isProduction) {
    writeData(localePaths, locales, data);
  }

  return (locale, key) => {
    if (locales.indexOf(locale) === -1) {
      throw new Error(`Unknown locale: ${locale}`);
    }
    let result = data[locale][key];

    if (isNil(result)) {
      syncKey(data, key, localePaths, locales, isProduction);
      return key;
    }

    return result;
  };
};

function readLocaleFiles(locales, localePaths, isProduction) {
  const result = {};

  for (let i = 0; i < locales.length; ++i) {
    if (!fs.existsSync(localePaths[i])) {
      if (!isProduction) {
        fs.mkdirSync(
          localePaths[i]
            .split("/")
            .slice(0, -1)
            .join("/"),
          { recursive: true },
        );

        fs.writeFileSync(localePaths[i], "{}", { encoding: "utf-8" });
      }
      result[locales[i]] = {};

      continue;
    }

    const raw = fs.readFileSync(localePaths[i], {
      encoding: "utf-8",
    });
    result[locales[i]] = JSON.parse(raw);
  }

  return result;
}

export function syncData(data) {
  // Returned value, should be set to true if any key is written to one of the locales
  let isDirty = false;
  const locales = Object.keys(data);

  // Create unique keys
  const keySet = new Set();
  for (const locale of locales) {
    for (const key of Object.keys(data[locale])) {
      keySet.add(key);
    }
  }

  // Most likely bigger, so loop only once
  for (const key of keySet.values()) {
    for (const locale of locales) {
      if (isNil(data[locale][key])) {
        isDirty = true;
        data[locale][key] = key;
      }
    }
  }

  return isDirty;
}

function syncKey(data, key, localePaths, locales, isProduction) {
  for (const locale of locales) {
    data[locale][key] = key;
  }

  if (!isProduction) {
    writeData(localePaths, locales, data);
  }
}

/**
 * Serialize and write all locale files
 * Note this is sync, as it should only be used in development mode
 * @param localePaths
 * @param locales
 * @param data
 */
function writeData(localePaths, locales, data) {
  for (let i = 0; i < locales.length; ++i) {
    fs.writeFileSync(localePaths[i], JSON.stringify(data[locales[i]]));
  }
}
