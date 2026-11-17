import { existsSync } from "node:fs";
import { defineConfig } from "vitest/config";

// CI has no .env, so fall back to the example values.
process.loadEnvFile(existsSync(".env") ? ".env" : ".env.example");
process.env.NODE_ENV = "test";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
