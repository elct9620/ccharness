import { ConsoleStopDecisionPresenter } from "@/presenters/ConsoleStopDecisionPresenter";
import { CmdGitService } from "@/services/CmdGitService";
import { JsonWorkingStateBuilder } from "@/services/JsonWorkingStateBuilder";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { GuardCommit } from "@/usecases/GuardCommit";
import type { StopHookInput } from "@/usecases/port";
import { container } from "tsyringe";

type GuardCommitOptions = {
  maxFiles: string;
  maxLines: string;
};

export async function guardCommitAction(options: GuardCommitOptions) {
  const decisionPresenter = container.resolve(ConsoleStopDecisionPresenter);

  if (
    process.env.CCHARNESS_HOOK_DISABLED === "true" ||
    process.env.CCHARNESS_HOOK_DISABLED === "1"
  ) {
    await decisionPresenter.pass("");
    return;
  }

  const readHookInputService = container.resolve(ReadHookInputService);
  const gitService = container.resolve(CmdGitService);
  const configBuilder = container.resolve(JsonWorkingStateBuilder);

  const hook = await readHookInputService.parse<StopHookInput>();

  const guardCommit = new GuardCommit(
    gitService,
    configBuilder,
    decisionPresenter,
  );
  await guardCommit.execute({
    hook,
    options: {
      maxFiles: parseInt(options.maxFiles, 10),
      maxLines: parseInt(options.maxLines, 10),
    },
  });
}
