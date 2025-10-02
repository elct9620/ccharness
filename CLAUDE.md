# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCharness is a lightweight harness for Claude Code, built with TypeScript and designed to be a CLI tool that provides hooks and utilities for Claude Code operations. It intercepts and processes Claude Code hook events to provide additional functionality like commit reminders and decision handling.

## Tech Stack

- **Language**: TypeScript 5.9+ with ESM modules
- **Build Tool**: Rolldown (v1.0.0-beta.36, Rust-based bundler)
- **Test Framework**: Vitest
- **Package Manager**: pnpm (v10.13.1)
- **CLI Framework**: Commander.js (v14)
- **Dependency Injection**: tsyringe with @abraham/reflection
- **Code Formatting**: Prettier (v3.6.2) with organize-imports plugin
- **Claude Agent SDK**: @anthropic-ai/claude-agent-sdk for API access
- **Output Formatting**: console-table-printer for structured console output

## Common Commands

```bash
# Install dependencies
pnpm install

# Build the project (creates dist/index.js)
pnpm build

# Run all tests
pnpm test

# Run tests in watch mode
vitest

# Run a specific test file
vitest tests/path/to/test.test.ts

# Run tests with coverage
vitest --coverage

# Format code
npx prettier --write .

# Check formatting
npx prettier --check .

# Test the CLI locally after build
node dist/index.js hook guard-commit --help
# or using npx with the current directory
npx . hook guard-commit

# Test hooks with mock input (for development)
echo '{"session_id":"test","cwd":"/path"}' | node dist/index.js hook guard-commit

# Review a file against configured rubrics
node dist/index.js review src/main.ts --max-retry 5
```

## Architecture

The project follows Clean Architecture principles with clear separation of concerns and dependency inversion:

### Layer Structure

```
src/
├── main.ts                    # CLI entry point with shebang (#!/usr/bin/env node)
├── token.ts                   # DI token symbols (IProjectRoot, IHookInputStream, IConsole, IConfigService)
├── constant.ts                # Shared constants and types (ConfigSchema, CommandOptions)
├── handlers/                  # Command handlers (entry points)
│   ├── hook/                 # Hook-related command handlers
│   │   ├── GuardCommit.ts    # Stop hook for commit reminders
│   │   ├── ReviewReminder.ts # PostToolUse hook for review reminders
│   │   ├── CommitReminder.ts # PostToolUse hook for commit reminders
│   │   └── AuditRead.ts      # Stop hook for restricting Read tool access
│   └── Review.ts             # Standalone review command handler
├── usecases/                  # Core business logic (framework-agnostic)
│   ├── interface.ts          # Domain interfaces with DI symbols
│   ├── port.ts               # Data transfer types for external inputs
│   ├── GuardCommit.ts        # Commit guard logic
│   ├── RemindToReview.ts     # Review reminder logic
│   ├── CommitReminder.ts     # Commit reminder logic
│   └── ReviewCode.ts         # Code review evaluation logic
├── entities/                  # Domain entities
│   ├── WorkingState.ts       # Git working directory state model
│   ├── Rubric.ts             # Code review rubric model
│   ├── ReviewReport.ts       # Review evaluation report
│   ├── Evaluation.ts         # Individual rubric evaluation
│   └── Criteria.ts           # Review criteria definition
├── services/                  # External system integrations
│   ├── CmdGitService.ts      # Git operations via CLI
│   ├── ReadHookInputService.ts # Parse Claude Code hook JSON input
│   ├── JsonConfigService.ts  # Configuration file loader
│   ├── JsonWorkingStateBuilder.ts # Config-aware state builder
│   └── ClaudeReviewService.ts # Claude Code API integration for reviews
├── repositories/              # Data access layer
│   └── JsonRubricRepository.ts # Rubric configuration repository
└── presenters/                # Output formatting for Claude Code
    ├── ConsoleDecisionPresenter.ts           # Base presenter
    ├── ConsoleStopDecisionPresenter.ts       # Stop hook decision output
    ├── ConsolePostToolUseDecisionPresenter.ts # PostToolUse hook output
    └── ConsoleReviewPresenter.ts             # Review command output formatting
```

### Dependency Injection Pattern

The project uses tsyringe for dependency injection with interface symbols:

1. **Token Definition** (in `src/token.ts`):
   ```typescript
   export const IConfigService = Symbol("IConfigService");
   export const IHookInputStream = Symbol("IHookInputStream");
   ```

2. **Interface Definition** (in `src/usecases/interface.ts`):
   ```typescript
   export const IGitService = Symbol("IGitService");
   export interface GitService { ... }
   ```

3. **Implementation** (in `services/` or `repositories/`):
   ```typescript
   @injectable()
   export class CmdGitService implements GitService { ... }
   ```

4. **Registration and Usage in Handlers**:
   ```typescript
   // Register implementation
   container.register(IGitService, { useClass: CmdGitService });
   
   // Resolve and use
   const gitService = container.resolve<GitService>(IGitService);
   ```

### Hook Input Processing

The system processes Claude Code hook events via stdin:
- `ReadHookInputService` reads JSON from stdin
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
├── hook                       # Hook-related commands
│   ├── guard-commit          # Stop hook for commit reminders
│   ├── review-reminder       # PostToolUse hook for review context
│   ├── commit-reminder       # PostToolUse hook for commit reminders
│   └── audit-read            # PreToolUse hook for restricting Read tool access
└── review                     # Standalone review command
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
- **Module System**: ESNext with bundler resolution
- **Path Alias**: `@/*` maps to `./src/*`
- **No Emit**: TypeScript doesn't emit files (handled by Rolldown)
- **Module Resolution**: Bundler mode for compatibility
- **Decorators**: `experimentalDecorators` and `emitDecoratorMetadata` enabled for tsyringe
- **Module Syntax**: `verbatimModuleSyntax` for strict ESM compliance

### Build Configuration

Rolldown bundles the entire application into a single ESM file:
- **Input**: `src/main.ts`
- **Output**: `dist/index.js` with executable shebang
- **Platform**: Node.js
- **TypeScript**: Uses `tsconfig.json` for compilation
- **Binary**: Exposed as `ccharness` command via package.json bin field

### Test Configuration

Vitest is configured with:
- **Setup File**: `tests/setup.ts` for DI container and mock initialization
- **Path Alias**: `@` maps to `/src` for test imports
- **Dependency Injection**: Automatic container cleanup and mock registration in beforeEach

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
   - Use `ReadHookInputService` to parse JSON input
   - Handle hook-specific fields (e.g., `stopHookActive`, `toolName`)

4. **Testing**:
   - **TDD Approach**: Always write tests first (feature tests for handlers)
   - Test files use `.test.ts` extension in the `tests/` directory mirroring source structure
   - Use Vitest for unit and integration tests with setup file at `tests/setup.ts`
   - Test helpers follow BDD step pattern (e.g., `givenHookInput`, `thenHookOutputShouldBe`) located in `tests/steps/`
   - Mock external dependencies using DI container registration
   - Test naming follows `describe('Feature') > describe('when condition') > it('is expected to behavior')` pattern
   - Code must pass quality rubric (80%+ score) defined in `docs/rubrics/testing.md`
   - Primary tests are feature tests in `tests/` for handlers unless specifically asked otherwise

## Configuration

The project supports configuration through JSON files in the project root:

### Configuration Files

- **`ccharness.json`**: Project-wide configuration that should be committed to version control
- **`ccharness.local.json`**: Local overrides for personal preferences (ignored by git)

When both files exist, `ccharness.local.json` settings will override `ccharness.json` settings.

### Configuration Schema

```json
{
  "claude": {
    "executablePath": "/path/to/claude"  // Optional: Custom Claude Code executable path
  },
  "commit": {
    "maxFiles": 10,     // Trigger reminder when files changed >= this value
    "maxLines": 500,    // Trigger reminder when lines changed >= this value
    "reminder": {       // PostToolUse hook commit reminder settings
      "maxFiles": 10,   // Optional: Override for commit-reminder hook
      "maxLines": 500,  // Optional: Override for commit-reminder hook
      "message": "Custom reminder message with {changedFiles} and {changedLines}"
    }
  },
  "review": {
    "blockMode": false  // Block execution instead of providing additional context
  },
  "audit": {
    "read": [           // File patterns to restrict Read tool access
      "*.env",
      "**/.env*",
      "**/secrets/**"
    ]
  },
  "rubrics": [          // Review rubric configurations
    {
      "name": "Testing Quality",
      "pattern": "tests\\/.*\\.(js|ts)$",  // Regex pattern to match files
      "path": "docs/rubrics/testing.md"    // Path to rubric document
    }
  ]
}
```

### Configuration Precedence

Settings are resolved in the following order (highest to lowest priority):

1. Command-line options (e.g., `--max-files`, `--max-lines`, `--block`)
2. `ccharness.local.json` (local overrides)
3. `ccharness.json` (project defaults)
4. Built-in defaults

## Available Hooks

### Guard Commit (Stop Hook)
Blocks Claude Code and suggests committing when working directory has too many changes.

### Review Reminder (PostToolUse Hook)
Adds context to remind Claude Code to review changes against configured rubrics after Write, Edit, or MultiEdit operations.

### Commit Reminder (PostToolUse Hook)
Adds context to remind Claude Code to commit when working directory has too many changes after Write, Edit, or MultiEdit operations. Uses customizable message templates with `{changedFiles}` and `{changedLines}` placeholders.

### Audit Read (PreToolUse Hook)
Restricts Claude Code's Read tool access to sensitive files based on configured file patterns. Checks the file path before the Read tool executes and denies access if it matches sensitive patterns.

### Review Command (Standalone)
Evaluates a file against configured rubrics using Claude Code API integration, providing detailed feedback and scores.

## Key Design Decisions

- **Clean Architecture**: Ensures business logic remains independent of frameworks and external systems
- **Dependency Injection**: Enables easy testing and swapping of implementations
- **Single Bundle Output**: Simplifies distribution as a CLI tool via npm/npx
- **Hook Input Processing**: Standardizes handling of Claude Code hook events with automatic snake_case to camelCase conversion
- **Presenter Pattern**: Provides structured JSON output format for Claude Code integration
- **Builder Pattern**: `JsonWorkingStateBuilder` for flexible state construction with config support
- **Repository Pattern**: `JsonRubricRepository` for abstracted data access
- **Step Pattern for Tests**: Provides readable test structure with given-when-then style helpers
- **TDD Development**: Use Test-Driven Development approach - write tests first, then implementation