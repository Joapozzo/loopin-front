const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Ruta a tu app Next.js para cargar next.config.js y archivos .env
  dir: "./",
});

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
};

module.exports = createJestConfig(customJestConfig);
