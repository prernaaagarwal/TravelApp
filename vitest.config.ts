import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
    },
  },
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      // Only files with a paired *.test.ts. Adding a new file with tests?
      // Add it here too — that's the trigger to write tests, not a chore
      // to skip. Untested legacy files stay out of the coverage gate so
      // they can't drag the metric down, but new code is held to 70%.
      // Coverage is enforced for files paired with tests. Adding a new
      // tested module? Add it here and write the test alongside.
      include: [
        "lib/intel-import.ts",
        "lib/intel-card-schema.ts",
        "lib/jsonld.ts",
        "lib/rate-limit.ts",
        "lib/search.ts",
        "lib/email-template.ts",
        "lib/ban-check.ts",
      ],
      // Files imported transitively but not in the gated set (e.g. email.ts
      // is glue around the Resend SDK; we only test the pure email-template
      // it composes).
      thresholds: {
        lines:     70,
        functions: 70,
        branches:  70,
        statements: 70,
      },
    },
  },
});
