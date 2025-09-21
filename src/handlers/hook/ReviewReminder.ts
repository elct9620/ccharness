import { container } from "tsyringe";

import { ConsolePostToolUseDecisionPresenter } from "@/presenters/ConsolePostToolUseDecisionPresenter";
import { JsonRubricRepository } from "@/repositories/JsonRubricRepository";
import { EnvFeatureService } from "@/services/EnvFeatureService";
import { JsonConfigService } from "@/services/JsonConfigService";
import { ReadHookInputService } from "@/services/ReadHookInputService";
import { IConfigService } from "@/token";
import { RemindToReview } from "@/usecases/RemindToReview";
import type { PostToolUseHookInput } from "@/usecases/port";

const ALLOWED_TOOLS = ["Write", "Edit", "MultiEdit"];

type ReviewReminderOptions = {
  block?: boolean;
};

export async function reviewReminderAction(
  options: ReviewReminderOptions = {},
) {
  const readHookInputService = container.resolve(ReadHookInputService);
  const featureService = container.resolve(EnvFeatureService);
  const configService = container.resolve<JsonConfigService>(IConfigService);
  const rubricRepository = container.resolve(JsonRubricRepository);
  const presenter = container.resolve(ConsolePostToolUseDecisionPresenter);

  const hook = await readHookInputService.parse<PostToolUseHookInput>();
  if (!ALLOWED_TOOLS.includes(hook.toolName)) {
    return;
  }

  const config = await configService.load();

  // Priority: CLI option provided > config > default false
  let blockMode = false;
  if (options.block !== undefined) {
    // -b/--block explicitly provided (true or false)
    blockMode = options.block;
  } else {
    // No CLI option provided, use config
    blockMode = config.review?.blockMode || false;
  }

  const remindeToReview = new RemindToReview(
    featureService,
    rubricRepository,
    presenter,
  );
  await remindeToReview.execute({
    filePath: hook.toolResponse.filePath,
    blockMode,
  });
}
