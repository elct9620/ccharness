import { container } from "tsyringe";

import { ConsolePostToolUseDecisionPresenter } from "@/presenters/ConsolePostToolUseDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { EnvFeatureService } from "@/services/EnvFeatureService";
import { JsonConfigService } from "@/services/JsonConfigService";
import { JsonWorkingStateBuilder } from "@/services/JsonWorkingStateBuilder";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { IConfigService } from "@/token";
import { CommitReminder } from "@/usecases/CommitReminder";
import type { PostToolUseHookInput } from "@/usecases/port";

const ALLOWED_TOOLS = ["Write", "Edit", "MultiEdit"];

type CommitReminderOptions = {
  maxFiles: string;
  maxLines: string;
};

export async function commitReminderAction(options: CommitReminderOptions) {
  const readHookInputService = container.resolve(ReadHookInputService);
  const featureService = container.resolve(EnvFeatureService);
  const gitService = container.resolve(CmdGitService);
  const stateBuilder = container.resolve(JsonWorkingStateBuilder);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const presenter = container.resolve(ConsolePostToolUseDecisionPresenter);

  const hook = await readHookInputService.parse<PostToolUseHookInput>();

  // Filter tools at handler level
  if (!ALLOWED_TOOLS.includes(hook.toolName)) {
    return;
  }

  const config = await configService.load();

  const commitReminder = new CommitReminder(
    featureService,
    gitService,
    stateBuilder,
    presenter,
  );
  await commitReminder.execute({
    hook,
    message: config.commit.reminder?.message,
    options: {
      maxFiles: parseInt(options.maxFiles, 10),
      maxLines: parseInt(options.maxLines, 10),
    },
  });
}
