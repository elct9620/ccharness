#!/usr/bin/env node

import "@abraham/reflection";
import { Command } from "commander";

import { guardCommitAction } from "@/handlers/hook/GuardCommit";
import "./container";
import { reviewReminderAction } from "./handlers/hook/ReviewReminder";

const program = new Command();

program
  .name("ccharness")
  .description("A lightweight harness for Claude Code")
  .version("0.2.0"); // x-release-please-version

const hook = program.command("hook").description("The hooks for Claude Code");
hook
  .command("guard-commit")
  .option(
    "-f, --max-files <number>",
    "The maximum number of files to trigger a commit reminder, use -1 to disable",
    "-1",
  )
  .option(
    "-l, --max-lines <number>",
    "The maximum number of lines changed to trigger a commit reminder, use -1 to disable",
    "-1",
  )
  .description(
    "Ensure the agent commit frequently according to the throttle limit",
  )
  .action(guardCommitAction);

hook
  .command("review-reminder")
  .description("Add additional context to reminders to review code after edits")
  .action(reviewReminderAction);

await program.parseAsync(process.argv);
