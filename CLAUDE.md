# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCharness is a lightweight harness for Claude Code, built with TypeScript and designed to be a CLI tool that provides hooks and utilities for Claude Code operations. It intercepts and processes Claude Code hook events to provide additional functionality like commit reminders and decision handling.

## Tech Stack

- **Language**: TypeScript 5.9+ with ESM modules
- **Build Tool**: Rolldown (v1.0.0-beta.34, Rust-based bundler)
- **Test Framework**: Vitest
- **Package Manager**: pnpm (v10.13.1)
- **CLI Framework**: Commander.js (v14)
- **Dependency Injection**: tsyringe with @abraham/reflection
- **Code Formatting**: Prettier (v3.6.2) with organize-imports plugin

## Common Commands

```bash
# Install dependencies
pnpm install

# Build the project (creates dist/index.js)
pnpm build
# or: rolldown -c rolldown.config.ts

# Run tests
pnpm test
# or: vitest --run

# Run tests in watch mode
vitest

# Format code
npx prettier --write .

# Check formatting
npx prettier --check .

# Run a specific test file
vitest path/to/test.spec.ts

# Run tests with coverage
vitest --coverage

# Test the CLI locally after build
node dist/index.js hook guard-commit --help
# or using npx with the current directory
npx . hook guard-commit
```

## Architecture

The project follows Clean Architecture principles with clear separation of concerns and dependency inversion:

### Layer Structure

```
src/
├── main.ts                    # CLI entry point with shebang (#!/usr/bin/env node)
├── handlers/                  # Command handlers (entry points)
│   └── hook/                 # Hook-related command handlers
│       ├── GuardCommit.ts    # Stop hook for commit reminders
│       └── ReviewReminder.ts # PostToolUse hook for review reminders
├── usecases/                  # Core business logic (framework-agnostic)
│   ├── interface.ts          # Domain interfaces with DI symbols
│   ├── port.ts               # Data transfer types for external inputs
│   ├── GuardCommit.ts        # Commit guard logic
│   └── RemindToReview.ts     # Review reminder logic
├── entities/                  # Domain entities
│   ├── WorkingState.ts       # Git working directory state model
│   └── Rubric.ts             # Code review rubric model
├── services/                  # External system integrations
│   ├── CmdGitService.ts      # Git operations via CLI
│   ├── StdinHookService.ts   # Parse Claude Code hook JSON input
│   ├── JsonConfigService.ts  # Configuration file loader
│   └── JsonWorkingStateBuilder.ts # Config-aware state builder
├── repositories/              # Data access layer
│   └── JsonRubricRepository.ts # Rubric configuration repository
└── presenters/                # Output formatting for Claude Code
    ├── ConsoleDecisionPresenter.ts           # Base presenter
    ├── ConsoleStopDecisionPresenter.ts       # Stop hook decision output
    └── ConsolePostToolUseDecisionPresenter.ts # PostToolUse hook output
```

### Dependency Injection Pattern

The project uses tsyringe for dependency injection with interface symbols:

1. **Interface Definition** (in `usecases/interface.ts`):
   ```typescript
   export const IGitService = Symbol("IGitService");
   export interface GitService { ... }
   ```

2. **Implementation** (in `services/` or `repositories/`):
   ```typescript
   @injectable()
   export class CmdGitService implements GitService { ... }
   ```

3. **Usage in Handlers** (in `handlers/`):
   ```typescript
   const gitService = container.resolve(CmdGitService);
   ```

### Hook Input Processing

The system processes Claude Code hook events via stdin:
- `StdinHookService` reads JSON from stdin
- Automatically converts snake_case to camelCase
- Provides typed interfaces via `port.ts`
- Stop hook input: `sessionId`, `transcriptPath`, `cwd`, `hookEventName`, `stopHookActive`
- PostToolUse hook input: includes `toolName`, `toolResponse` with file paths

### Environment Variables

- `CLAUDE_PROJECT_DIR`: Set by Claude Code to specify the project root directory
  - Used by `CmdGitService` for Git operations
  - Used by `JsonWorkingStateBuilder` and `JsonConfigService` for config file resolution
  - Falls back to `process.cwd()` when not set (e.g., during local testing)

### Command Structure

Commands follow a hierarchical pattern using Commander.js:
```
ccharness [command] [subcommand] [options]
└── hook                       # Hook-related commands
    ├── guard-commit          # Stop hook for commit reminders
    └── review-reminder       # PostToolUse hook for review context
```

### Use Case Layer Rules

**IMPORTANT**: Use cases in `src/usecases/` must be:
- Plain TypeScript/JavaScript classes
- No framework dependencies
- No decorators (`@injectable`, etc.)
- Receive dependencies via constructor injection
- Focus purely on business logic

### Presenter Output Format

Stop hook presenters output structured JSON:
```json
{
  "decision": "block" | undefined,
  "reason": "string"
}
```

PostToolUse hook presenters output:
```json
{
  "reason": "",
  "hookSpecificOutput": {
    "additionalContext": "string | undefined"
  }
}
```

### TypeScript Configuration

- **Strict Mode**: Full strict checking enabled
- **Additional Checks**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Module System**: NodeNext with ESM
- **Path Alias**: `@/*` maps to `./src/*`
- **No Emit**: TypeScript doesn't emit files (handled by Rolldown)
- **Module Resolution**: Bundler mode for compatibility

### Build Configuration

Rolldown bundles the entire application into a single ESM file:
- **Input**: `src/main.ts`
- **Output**: `dist/index.js` with executable shebang
- **Platform**: Node.js
- **Binary**: Exposed as `ccharness` command via package.json bin field

## Development Workflow

1. **Adding a New Hook Command**:
   - Create handler in `src/handlers/hook/[CommandName].ts`
   - Register command in `src/main.ts` using Commander
   - Implement use case in `src/usecases/` (no decorators)
   - Add services/presenters as needed with `@injectable()`
   - Update hook input types in `src/usecases/port.ts` if needed

2. **Adding a New Service**:
   - Define interface in `src/usecases/interface.ts` with Symbol
   - Implement in `src/services/` with `@injectable()` decorator
   - Use via `container.resolve()` in handlers

3. **Processing Hook Input**:
   - Define input types in `src/usecases/port.ts`
   - Use `StdinHookService` to parse JSON input
   - Handle hook-specific fields (e.g., `stopHookActive`, `toolName`)

4. **Testing**:
   - Place test files alongside source files with `.spec.ts` or `.test.ts` extension
   - Use Vitest for unit and integration tests
   - Mock external dependencies using DI container

## Configuration

The project supports a `ccharness.json` configuration file in the project root:

```json
{
  "commit": {
    "maxFiles": 10,     // Trigger reminder when files changed >= this value
    "maxLines": 500     // Trigger reminder when lines changed >= this value
  },
  "rubrics": [          // Review rubric configurations
    {
      "name": "vitest",
      "pattern": "test/.*\\.test\\.ts$",  // Regex pattern to match files
      "path": "docs/rubrics/vitest.md"    // Path to rubric document
    }
  ]
}
```

Configuration precedence for commit guard:
1. CLI options (`--max-files`, `--max-lines`)
2. `ccharness.json` file (if CLI options are `-1` or not provided)
3. Default value of `-1` (disabled)

## Available Hooks

### Guard Commit (Stop Hook)
Blocks Claude Code and suggests committing when working directory has too many changes.

### Review Reminder (PostToolUse Hook)
Adds context to remind Claude Code to review changes against configured rubrics after Write, Edit, or MultiEdit operations.

## Key Design Decisions

- **Clean Architecture**: Ensures business logic remains independent of frameworks and external systems
- **Dependency Injection**: Enables easy testing and swapping of implementations
- **Single Bundle Output**: Simplifies distribution as a CLI tool
- **Hook Input Processing**: Standardizes handling of Claude Code hook events
- **Presenter Pattern**: Provides structured output format for Claude Code integration
- **Builder Pattern**: `JsonWorkingStateBuilder` for flexible state construction with config support
- **Repository Pattern**: `JsonRubricRepository` for abstracted data access