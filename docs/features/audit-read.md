# Audit Read

By default, Claude Code does not limit read access to sensitive files in the project directory. The official documentation suggests using hooks to restrict read access, this feature is designed to provide that functionality out of the box.

## Configuration

The senstive files can be configured in the `ccharness.json` file under the `audit.read` section. You can specify a list of file paths or glob patterns that should be restricted.

```json
{
  "audit": {
    "read": [
      "path/to/sensitive/file.txt",
      "another/sensitive/*.log"
    ]
  }
}
```

## Command

This hook is registered under the command `hook audit-read`. You can use this command in the `PreToolUse` hook with `Read` filter.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "npx -y @aotoki/ccharness hook audit-read"
          }
        ]
      }
    ]
  }
}
```

## Behavior

When the hook is triggered, it read Claude Code's standard input to get the file path that is being accessed. If the file path matches any of the configured sensitive files, the hook will return "deny" decision and explain the reason. Otherwise, it will return "allow" decision.

Example output when access is denied:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "The file path 'path/to/sensitive/file.txt' is restricted."
  }
}
```
