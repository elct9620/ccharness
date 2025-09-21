# Disable Hook

For benchmarking purposes, you might want to disable the hook that can verify the hook can help Claude Code to improve its performance.

## Configuration

The `CCHARNESS_HOOK_DISABLED` environment variable can be set to `true` or `1` to disable the hook.

## Command

For each hook command, you can prepend `CCHARNESS_HOOK_DISABLED=true` to disable the hook.

```bash
CCHARNESS_HOOK_DISABLED=true npx -y @aotoki/ccharness hook review-reminder
```

## Behavior

When the environment variable is set, the hook will immediately return "allow" decision without performing any checks.
