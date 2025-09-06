#!/usr/bin/env node

import "@abraham/reflection";
import { Command } from "commander";

import { guardCommitAction } from "@/handlers/hook/GuardCommit";
import { reviewAction } from "@/handlers/Review";
import "./container";
import { reviewReminderAction } from "./handlers/hook/ReviewReminder";

const program = new Command();

program
  .name("ccharness")
  .description("A lightweight harness for Claude Code")
  .version("0.5.0"); // x-release-please-version

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
  .option(
    "-b, --block",
    "Block execution instead of providing additional context",
  )
  .description("Add additional context to reminders to review code after edits")
  .action(reviewReminderAction);

program
  .command("review")
  .argument("<path>", "Path to the file to review")
  .description("Review a file against configured rubrics")
  .action(reviewAction);

await program.parseAsync(process.argv);
