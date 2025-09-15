import { container } from "tsyringe";

import { ConsolePostToolUseDecisionPresenter } from "@/presenters/ConsolePostToolUseDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { JsonConfigService } from "@/services/JsonConfigService";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { IConfigService } from "@/token";
import { CommitReminder } from "@/usecases/CommitReminder";
import type { PostToolUseHookInput } from "@/usecases/port";

type CommitReminderOptions = {
  maxFiles: string;
  maxLines: string;
};

export async function commitReminderAction(options: CommitReminderOptions) {
  const readHookInputService = container.resolve(ReadHookInputService);
  const gitService = container.resolve(CmdGitService);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const presenter = container.resolve(ConsolePostToolUseDecisionPresenter);

  const hook = await readHookInputService.parse<PostToolUseHookInput>();
  const config = await configService.load();

  const commitReminder = new CommitReminder(gitService, presenter);
  await commitReminder.execute({
    hook,
    config,
    options: {
      maxFiles: parseInt(options.maxFiles, 10),
      maxLines: parseInt(options.maxLines, 10),
    },
  });
}
