module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: true,
  cacheDirectory: ".jest-cache",
  coverageDirectory: ".jest-coverage",
  coverageReporters: ["html", "text"],
};
