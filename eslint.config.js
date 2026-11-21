import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "coverage"]),

  // TypeScript source: rules that use type information (e.g. a promise you forgot to await).
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: { allowDefaultProject: ["vitest.config.ts"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Unused names are errors; prefix with _ when a parameter must exist (Express error handler).
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // `import type` for types only, so they disappear from the build.
      "@typescript-eslint/consistent-type-imports": "error",
      // Use the pino logger; console only for errors before the logger exists (config/env.ts).
      "no-console": ["error", { allow: ["error"] }],
      eqeqeq: "error",
    },
  },

  // Tests read untyped JSON bodies from supertest.
  {
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },

  // Plain JS config files (eslint, commitlint).
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
]);
