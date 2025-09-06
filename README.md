# Claude Code Harness

A set of lightweight tools for Claude Code users to improve their experience.

> [!WARNING]
> The hook is dangerous. Please review the code before using it, or fork and modify it to suit your needs.

## Usage

Use `npx -y @aotoki/ccharness <command>` to run commands without installing globally.

### Hooks

Create a new hook in Claude Code with specified hook.

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "npx -y @aotoki/ccharness hook guard-commit"
          }
        ]
      }
    ]
  }
}
```

## Commands

Following commands are available to help your Claude Code workflow.

## Hooks

### Guard Commit

A `Stop` hook to ensure Claude Code make a commit when throttled.

```bash
npx -y @aotoki/ccharness hook guard-commit
```

Options:

- `-f`, `--max-files <number>`: When exceeding the number of changed files, ask Claude Code to commit. Default is `-1` (disabled).
- `-l`, `--max-lines <number>`: When exceeding the number of changed lines, ask Claude Code to commit. Default is `-1` (disabled).

### Review Reminder

A `PostToolUse` hook for `Write`, `Edit`, `MultiEdit` tool to remind Claude Code to review with rubric(s).

```bash
npx -y @aotoki/ccharness hook review-reminder
```

Options:

- `-b`, `--block`: Block execution instead of providing additional context. When enabled, the hook will block Claude Code from proceeding until the review is addressed. Default is `false`.

> Currently, we only add context to remind agent we have rubric document, and use it to review the changes.

## Review (Experimental)

Review a file against configured rubrics to get evaluation scores and feedback.

```bash
npx -y @aotoki/ccharness review <path> [options]
```

Arguments:

- `<path>`: Path to the file to review against configured rubrics

Options:

- `--max-retry <number>`: Maximum number of retry attempts if the review encounters errors. Default is `3`.

Example:

```bash
# Review with custom retry limit
npx -y @aotoki/ccharness review src/main.ts --max-retry 5
```

This command matches the file against rubric patterns defined in `ccharness.json` and provides evaluation results with scores and comments. If the review fails due to temporary errors, it will automatically retry up to the specified number of times.

> [!NOTE]
> Currently, the prompt for Claude Code cannot ensure output format. It may not work as expected after multiple retries.

## Configuration

CCharness supports configuration through JSON files in your project root:

### Configuration Files

- **`ccharness.json`**: Project-wide configuration that should be committed to version control
- **`ccharness.local.json`**: Local overrides for personal preferences (ignored by git)

When both files exist, `ccharness.local.json` settings will override `ccharness.json` settings.

### Configuration Schema

```json
{
  "commit": {
    "maxFiles": 10,
    "maxLines": 500
  },
  "review": {
    "blockMode": false
  },
  "rubrics": [
    {
      "name": "vitest",
      "pattern": "test/.*\\.test\\.ts$",
      "path": "docs/rubrics/vitest.md"
    }
  ]
}
```

### Configuration Precedence

Settings are resolved in the following order (highest to lowest priority):

1. Command-line options (e.g., `--max-files`, `--max-lines`)
2. `ccharness.local.json` (local overrides)
3. `ccharness.json` (project defaults)
4. Built-in defaults
