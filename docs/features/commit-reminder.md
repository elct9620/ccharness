# Commit Reminder

We already have `guard-commit` hook to ensure Claude Code make commit if too many changes are made. However, it only check when a work is done. This feature provides additional reminder after editing files to improve commit frequency.

## Configuration

The commit reminder can be configured in the `ccharness.json` file under the `commit.reminder` section. You can specify the number of edits after which a reminder should be issued.

```json
{
  "commit": {
    "reminder": {
      "maxFiles": 5,
      "maxLines": 50,
      "message": "To make outside-in with small increments, you have make too many changes without committing. Make sure you have create minimal tests and pass them before commit."
    }
  }
}
```

- `maxFiles`: The maximum number of changed files allowed before a reminder is issued. Default is inherited from `commit.maxFiles` or `-1` (disabled).
- `maxLines`: The maximum number of changed lines allowed before a reminder is issued. Default is inherited from `commit.maxLines` or `-1` (disabled).

The user can also customize the reminder message to fit their workflow. By default, the message is: "You have changed {changedFiles} files and {changedLines} lines without committing. Consider making a commit to save your progress."

## Command

This hook is registered under the command `hook commit-reminder`. You can use this command in the `PostToolUse` hook with `Write`, `Edit`, or `MultiEdit` filter.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "npx -y @aotoki/ccharness hook commit-reminder"
          }
        ]
      }
    ]
  }
}
```

User can use `-f`/`--max-files` and `-l`/`--max-lines` options to override the configuration in `ccharness.json`.

## Behavior

When the hook is triggered, it checks the number of changed files and lines since the last commit. If the number exceeds the configured thresholds, the hook will provide a reminder message to encourage Claude Code to make a commit.

Example output when reminder is issued:

```json
{
  "reason": "",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "To make outside-in with small increments, you have make too many changes without committing. Make sure you have create minimal tests and pass them before commit."
  }
}
```
