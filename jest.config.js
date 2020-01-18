const patterns = ["<rootDir>/packages/(?:.+?)/dist/", ".+\\.test-gen\\.ts"];

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts", "node"],
  cacheDirectory: ".jest-cache",
  coverageDirectory: ".jest-coverage",
  coveragePathIgnorePatterns: [...patterns],
  coverageReporters: ["text"],
  testPathIgnorePatterns: [...patterns],
  watchPathIgnorePatterns: [...patterns],
};
