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

### Review Reminder (Experimental)

A `PostToolUse` hook for `Write`, `Edit`, `MultiEdit` tool to remind Claude Code to review with rubric(s).

```bash
npx -y @aotoki/ccharness hook review-reminder
```

Options:

- `-b`, `--block`: Block execution instead of providing additional context. When enabled, the hook will block Claude Code from proceeding until the review is addressed. Default is `false`.

> Currently, we only add context to remind agent we have rubric document, and use it to review the changes.

## Configuration

The most config can use `ccharness.json` in project root to customize the behavior.

```json
{
  "commit": {
    "maxFiles": 10,
    "maxLines": 500
  },
  "review": {
    "blockEdit": false
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
