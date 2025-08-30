# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CCharness is a lightweight harness for Claude Code, built with TypeScript and designed to be a CLI tool.

## Tech Stack

- **Language**: TypeScript with ESM modules
- **Build Tool**: Rolldown (beta)
- **Test Framework**: Vitest
- **Package Manager**: pnpm (v10.13.1)

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
# or directly: rolldown src/main.ts --file dist/index.js

# Run tests
pnpm test
# or: vitest --run

# Run tests in watch mode
vitest
```

## Project Structure

- `src/main.ts` - Main entry point for the CLI tool
- `dist/index.js` - Built output file (ESM module with shebang for CLI)
- Binary exposed as `ccharness` command when installed

## TypeScript Configuration

- Strict mode enabled with additional strict checks
- ESM module system (nodenext)
- No emit (build handled by Rolldown)
- Additional strict options: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

## Build System

Uses Rolldown (a Rust-based bundler, currently in beta) for building the TypeScript code into a single JavaScript file suitable for CLI usage.