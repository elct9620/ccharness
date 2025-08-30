# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCharness is a lightweight harness for Claude Code, built with TypeScript and designed to be a CLI tool that provides hooks and utilities for Claude Code operations.

## Tech Stack

- **Language**: TypeScript with ESM modules
- **Build Tool**: Rolldown (v1.0.0-beta.34, Rust-based bundler)
- **Test Framework**: Vitest
- **Package Manager**: pnpm (v10.13.1)
- **CLI Framework**: Commander.js (v14)

## Common Commands

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
# or: rolldown -c rolldown.config.ts

# Run tests
pnpm test
# or: vitest --run

# Run tests in watch mode
vitest
```

## Architecture

The project follows Clean Architecture principles with clear separation of concerns:

### Directory Structure
- `src/main.ts` - CLI entry point with shebang, defines Commander.js commands
- `src/handlers/` - Command handler functions organized by command hierarchy
  - `hook/commit.ts` - Example: handler for `ccharness hook commit` command

### Command Pattern
Commands are structured hierarchically using Commander.js:
```typescript
// Main command -> subcommand -> nested command
// Example: ccharness hook commit
const hook = program.command('hook')
hook.command('commit').action(commitAction)
```

Handler functions are exported from separate files for better organization.

### TypeScript Configuration

- Strict mode with additional checks: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Module system: NodeNext with ESM
- Path alias: `@/*` maps to `./src/*`
- No emit (build handled by Rolldown)
- Bundler module resolution for compatibility

### Build Output

- Single bundled ESM file at `dist/index.js` with executable shebang
- Binary exposed as `ccharness` command when installed via npm/pnpm