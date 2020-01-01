module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: [ "js", "json", "ts", "node" ],
  cacheDirectory: ".jest-cache",
  coverageDirectory: ".jest-coverage",
  coveragePathIgnorePatterns: [ "<rootDir>/packages/(?:.+?)/dist/" ],
  coverageReporters: [ "text" ],
  testPathIgnorePatterns: [ "<rootDir>/packages/(?:.+?)/dist/" ],
};
