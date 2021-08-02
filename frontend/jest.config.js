module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/test/coverage",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@/components(.*)$": "<rootDir>/components$1",
    "^@/pages(.*)$": "<rootDir>/pages$1",
    "^@/hooks(.*)$": "<rootDir>/hooks$1",
    "^@/lib(.*)$": "<rootDir>/lib$1",
    "^@/types(.*)$": "<rootDir>/types$1",
  },
};
