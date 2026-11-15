import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

// jsdom by default for component tests; API and server tests opt into Node with a
// `/** @jest-environment node */` comment at the top of the file.
export default createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
});
