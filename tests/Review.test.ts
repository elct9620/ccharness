import { describe, it } from "vitest";

import { reviewAction } from "@/handlers/Review";
import { givenConfig } from "tests/steps/common";
import {
  givenReviewService,
  thenReviewOutputShouldBe,
} from "tests/steps/review";

describe("Review", () => {
  describe("when reviewing a file without matching rubrics", () => {
    it("is expected to output no matching rubrics message", async () => {
      await givenConfig({
        commit: { maxFiles: -1, maxLines: -1 },
        rubrics: [
          {
            name: "vitest",
            pattern: "\\.test\\.ts$",
            path: "docs/rubrics/vitest.md",
          },
        ],
      });
      await givenReviewService();

      await reviewAction("src/main.ts");

      await thenReviewOutputShouldBe("No matching rubrics found for this file");
    });
  });

  describe("when reviewing a file with single matching rubric", () => {
    it("is expected to output single evaluation", async () => {
      await givenConfig({
        commit: { maxFiles: -1, maxLines: -1 },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
        ],
      });
      await givenReviewService();

      await reviewAction("src/main.ts");

      await thenReviewOutputShouldBe("typescript: 1/1 (100%)");
    });
  });

  describe("when reviewing a file with multiple matching rubrics", () => {
    it("is expected to output multiple evaluations", async () => {
      await givenConfig({
        commit: { maxFiles: -1, maxLines: -1 },
        rubrics: [
          {
            name: "typescript",
            pattern: "\\.ts$",
            path: "docs/rubrics/typescript.md",
          },
          {
            name: "main",
            pattern: "main\\.ts$",
            path: "docs/rubrics/main.md",
          },
        ],
      });
      await givenReviewService();

      await reviewAction("src/main.ts");

      await thenReviewOutputShouldBe(
        "typescript: 1/1 (100%)\nmain: 1/1 (100%)",
      );
    });
  });
});
