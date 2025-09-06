import { query } from "@anthropic-ai/claude-code";
import { inject, injectable } from "tsyringe";

import { Criteria } from "@/entities/Criteria";
import { Evaluation } from "@/entities/Evaluation";
import type { Rubric } from "@/entities/Rubric";
import { IConfigService } from "@/token";
import type { ReviewService } from "@/usecases/interface";
import type { ConfigService } from "./interface";

@injectable()
export class ClaudeReviewService implements ReviewService {
  constructor(@inject(IConfigService) private configService: ConfigService) {}

  async review(
    path: string,
    rubric: Rubric,
    maxRetry: number = 3,
  ): Promise<Evaluation> {
    const config = await this.configService.load();

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetry; attempt++) {
      try {
        const result = await this.callAgent(
          `Review the code at path: ${path} based on the following rubric: ${JSON.stringify(rubric)}. MUST respond in PURE JSON without any additional text, code blocks, or XML tags.`,
          config.claude,
        );

        const parsed = JSON.parse(result);
        const evaluation = new Evaluation(rubric.name);

        for (const item of parsed.items) {
          const evaluationItem = new Criteria(
            item.name || "Unknown",
            item.score || 0,
            item.maxScore || 0,
            item.comment,
          );
          evaluation.add(evaluationItem);
        }

        return evaluation;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetry) {
          // Continue to next attempt
          continue;
        }
      }
    }

    // All retries exhausted, return empty evaluation
    const evaluation = new Evaluation(rubric.name);
    return evaluation;
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

        Filling in orders, comment, maxScore, and score for each criterion in the rubric with following JSON format.
        If you cannot provide a score, give 0 as the score and explain why in the comment.

        <schema>
        {
          "items": [
            {
              "name": "Name of the criteria",
              "comment": "A brief explanation of the score to help the user understand your reasoning.",
              "maxScore": number, // the points defined in the rubric
              "score": number // only 0 or the points defined in the rubric
            }
          ]
        }
        </schema>

        Following is an example of the JSON format you should return, do not include any other text, code blocks, or XML tags in final response.

        <example>
        {
          "items": [
            {
              "name": "Code Quality",
              "comment": "The code is well-structured and follows best practices.",
              "maxScore": 10,
              "score": 10
            },
            {
              "name": "Documentation",
              "comment": "The code lacks sufficient comments and documentation.",
              "maxScore": 5,
              "score": 2
            }
          ]
        }
        </example>
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
