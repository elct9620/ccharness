# Architecture

This document provides an overview of the `ccharness` project architecture.

## Structure

The `ccharness` project is following Clean Architecture principles, which emphasizes separation of concerns and independence of frameworks.

```
|- src/
   |- main.ts   # Application entry point
   |- handlers/ # Entry points for command handlers
```

## Command Handlers

The `handlers` directory contains the commander.js action functions that serve as entry points for various commands.

Following is example of a command handler:

```typescript
// src/handlers/hook/commit.ts
// const hook = program.command('hook')
// hook.command('commit').action(commitAction)

export async function commitAction() {
  // Command handler logic
}
```
