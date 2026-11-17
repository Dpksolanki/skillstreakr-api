// Checks every commit message (run by .husky/commit-msg).
// Format:  <type>: <short description>
// Example: feat: add streak counter API

const allowedTypes = [
  "feat", //     New feature the user can see       -> feat: add streak counter API
  "fix", //      Bug fix                             -> fix: streak resets at wrong timezone
  "chore", //    Setup, configs, packages, tooling   -> chore: setup express api with class structure
  "refactor", // Code changed, behaviour the same    -> refactor: move user logic into service
  "test", //     Only tests added or changed         -> test: add health route tests
  "docs", //     Only documentation                  -> docs: add local setup steps to README
  "style", //    Formatting only (spaces, semicolons) -> style: format with prettier
  "perf", //     Makes something faster              -> perf: add index on habits.user_id
  "ci", //       GitHub Actions / pipeline           -> ci: add test workflow
  "build", //    Build system or dependencies        -> build: upgrade typescript to 7
];

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one from the list above.        Blocked: feature: add x   Blocked: revert: undo x
    "type-enum": [2, "always", allowedTypes],
    // Type must be lowercase.                      Blocked: Feat: add x
    "type-case": [2, "always", "lower-case"],
    // Type is required.                            Blocked: added stuff
    "type-empty": [2, "never"],
    // Description after ":" is required.           Blocked: feat:
    "subject-empty": [2, "never"],
    // Description can be any case.                 Allowed: feat: add API for Streaks
    "subject-case": [0],
    // Whole first line max 100 characters.         Blocked: a very long message...
    "header-max-length": [2, "always", 100],
  },
};

// Rule format: [level, "always" | "never", value]
// level: 0 = off, 1 = warning (commit still allowed), 2 = error (commit blocked)
