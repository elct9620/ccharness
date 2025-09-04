import { describe, it } from "vitest";

import { reviewAction } from "@/handlers/Review";
import { thenReviewOutputShouldBe } from "tests/steps/review";

describe("Review", () => {
  describe("when reviewing a file", () => {
    it("is expected to output score", async () => {
      await reviewAction("src/main.ts");

      await thenReviewOutputShouldBe("Score: 1/1");
    });
  });
});
