import { query } from "@anthropic-ai/claude-code";
import { inject, injectable } from "tsyringe";

import { Evaluation } from "@/entities/Evaluation";
import type { Rubric } from "@/entities/Rubric";
import { IConfigService } from "@/token";
import type { ReviewService } from "@/usecases/interface";
import type { ConfigService } from "./interface";

@injectable()
export class ClaudeReviewService implements ReviewService {
  constructor(@inject(IConfigService) private configService: ConfigService) {}

  async review(path: string, rubric: Rubric): Promise<Evaluation> {
    const config = await this.configService.load();

    const result = await this.callAgent(
      `Review the code at path: ${path} based on the following rubric: ${JSON.stringify(rubric)}. Provide your response in pure JSON format without any additional text or code blocks.`,
      config.claude,
    );
    try {
      const parsed = JSON.parse(result);
      const totalPoints = parsed.items.reduce(
        (sum: number, item: any) => sum + (item.score || 0),
        0,
      );
      const score = parsed.items.reduce(
        (sum: number, item: any) => sum + (item.maxScore || 0),
        0,
      );

      return new Evaluation(rubric.name, score, totalPoints);
    } catch (error) {
      return new Evaluation(rubric.name, 0, 0);
    }

    return new Evaluation(rubric.name, 1, 1);
  }

  private async callAgent(
    prompt: string,
    options?: { executablePath?: string },
  ): Promise<string> {
    for await (const message of query({
      prompt,
      options: {
        model: "sonnet",
        maxTurns: 50,
        hooks: {},
        pathToClaudeCodeExecutable: options?.executablePath!,
        customSystemPrompt: `You are expert engineer that helps to review code.
        The user will provide you path and a rubric. Think more about the rubric and the code step by step.

        Return a JSON object with the following structure, the values should be filled based on your analysis:

        {
          "items": [
            {
              "name": "Name of the criteria",
              "score": number, // only 0 or the points defined in the rubric
              "maxScore": number, // the points defined in the rubric
              "comment": "A brief explanation of the score to help the user understand your reasoning."
            }
          ]
        }

        If you cannot provide a score, give 0 as the score and explain why in the comment.
        Ensure the JSON is properly formatted and can be parsed in the last message, do not include any other text outside the JSON object.
        `,
        allowedTools: ["Read"],
      },
    })) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          return message.result;
        } else {
          return '{ "items": [] }';
        }
      } else {
        continue;
      }
    }

    return '{ "items": [] }';
  }
}
