import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone Chrome extension — uses cross-file globals via manifest.json
    // load order, which ESLint can't model. Has its own runtime context.
    "chrome-extension/**",
    // Vitest coverage HTML output — generated, not source.
    "coverage/**",
  ]),
]);

export default eslintConfig;
