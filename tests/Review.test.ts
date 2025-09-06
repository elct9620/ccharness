import { describe, it } from "vitest";

import { reviewAction } from "@/handlers/Review";
import { givenConfig } from "tests/steps/common";
import {
  givenReviewResult,
  thenReviewOutputShouldBe,
  thenReviewOutputShouldContain,
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
      await givenReviewResult([]);

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
      await givenReviewResult([
        { name: "typescript", items: [{ score: 1, total: 1 }] },
      ]);

      await reviewAction("src/main.ts");

      await thenReviewOutputShouldContain(
        "Review src/main.ts with rubric typescript",
      );
      await thenReviewOutputShouldContain("Evaluation");
      await thenReviewOutputShouldContain("typescript");
      await thenReviewOutputShouldContain("100%");
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
      await givenReviewResult([
        { name: "typescript", items: [{ score: 1, total: 1 }] },
        { name: "main", items: [{ score: 1, total: 1 }] },
      ]);

      await reviewAction("src/main.ts");

      await thenReviewOutputShouldContain(
        "Review src/main.ts with rubric typescript",
      );
      await thenReviewOutputShouldContain(
        "Review src/main.ts with rubric main",
      );
      await thenReviewOutputShouldContain("Evaluation");
      await thenReviewOutputShouldContain("typescript");
      await thenReviewOutputShouldContain("main");
      await thenReviewOutputShouldContain("100%");
    });
  });

  describe("when reviewing a file with evaluation items containing comments", () => {
    it("is expected to output evaluation items with comments", async () => {
      await givenConfig({
        commit: { maxFiles: -1, maxLines: -1 },
        rubrics: [
          {
            name: "testing",
            pattern: "\\.test\\.ts$",
            path: "docs/rubrics/testing.md",
          },
        ],
      });
      await givenReviewResult([
        {
          name: "testing",
          items: [
            {
              score: 1,
              total: 1,
              comment: "Test case naming follows BDD format",
            },
            { score: 1, total: 1, comment: "Uses proper step functions" },
            { score: 0, total: 1, comment: "Missing proper mocking strategy" },
          ],
        },
      ]);

      await reviewAction("src/example.test.ts");

      await thenReviewOutputShouldContain(
        "Review src/example.test.ts with rubric testing",
      );
      await thenReviewOutputShouldContain("Evaluation");
      await thenReviewOutputShouldContain("testing");
      await thenReviewOutputShouldContain("67%");
      await thenReviewOutputShouldContain(
        "Test case naming follows BDD format",
      );
      await thenReviewOutputShouldContain("Uses proper step functions");
      await thenReviewOutputShouldContain("Missing proper mocking strategy");
    });
  });
});
