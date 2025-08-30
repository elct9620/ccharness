# Architecture

This document provides an overview of the `ccharness` project architecture.

## Structure

The `ccharness` project is following Clean Architecture principles, which emphasizes separation of concerns and independence of frameworks.

```
|- src/
   |- main.ts   # Application entry point
   |- entities/ # Core business entities
   |- usecases/ # The application business logic
   |- handlers/ # Entry points for command handlers
   |- presenters/ # Interfaces for output or presentation logic
   |- services/ # Interfaces to external systems
```

## Service

The `services` directory contains interfaces and implementations for external systems. This layer is responsible for communication with API services and other external dependencies.

Example service interface:

```typescript
// src/services/gitService.ts

import { GitService } from '@/usecases/interface'

@injectable()
export class CmdGitService implements GitService {
  // Implementation of GitService methods
}
```

## Entity

The `entities` directory contains the core business entities of the application. These entities represent the main concepts and data structures used in the application.

> **IMPORTANT:** The entity should be plain TypeScript/JavaScript without any dependencies on external libraries or frameworks also no decorators.

Example entity:

```typescript
// src/entities/CommitConfig.ts

export class CommitConfig {
  constructor(public readonly maxFiles: number, public readonly maxLines: number) {}

  isExceededFiles(fileCount: number): boolean {
    return fileCount >= this.maxFiles
  }

  isExceededLines(lineCount: number): boolean {
    return lineCount > this.maxLines
  }
}
```

## Use Case

The `usecases` directory contains the core business logic of the application. Each use case represents a specific operation that the application can perform.

> **IMPORTANT:** The use case should be plain TypeScript/JavaScript without any dependencies on external libraries or frameworks also no decorators.

Example use case:

```typescript
// src/usecases/CommitReminderCommand.ts

import { GitService } from './interface'

export class CommitReminderCommand {
  constructor(private gitService: GitService) {}

  async execute() {
    // Business logic for commit reminder
  }
}
```

## Handler (Command)

The `handlers` directory contains the commander.js action functions that serve as entry points for various commands.

Following is example of a command handler:

```typescript
// src/handlers/hook/commit.ts
// const hook = program.command('hook')
// hook.command('commit').action(commitAction)

export async function commitAction() {
    const gitService = container.resolve<GitService>(CmdGitService)
    const command = new CommitReminderCommand(gitService)
    await command.execute()
}
```

## Presenter

The `presenters` directory contains interfaces and implementations for output or presentation logic. By the default, the output is displayed for Claude Code to provide context for the agent.

Example presenter interface:

```typescript
// src/presenters/ConsoleStopDecisionPresenter.ts
import { StopDecisionPresenter } from '@/usecases/interface'

@injectable()
export class ConsoleStopDecisionPresenter implements StopDecisionPresenter extends ConsoleDecisionPresenter {
    async allow(reason?: string): void {
        return this.render({ decision: undefined, reason: reason || '' })
    }

    async block(reason: string): void {
        return this.render({ decision: 'block', reason })
    }
}
```
