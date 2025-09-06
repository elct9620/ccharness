import { Table } from "console-table-printer";
import { inject, injectable } from "tsyringe";

import type { ReviewReport } from "@/entities/ReviewReport";
import { IConsole } from "@/token";
import type { ReviewPresenter } from "@/usecases/interface";

@injectable()
export class ConsoleReviewPresenter implements ReviewPresenter {
  constructor(@inject(IConsole) private readonly console: Console) {}

  async progress(status: string): Promise<void> {
    this.console.log(status);
  }

  async display(report: ReviewReport): Promise<void> {
    if (report.isEmpty) {
      this.console.log("No matching rubrics found for this file");
      return;
    }

    const summaryTable = new Table({
      title: "📊 Review Summary",
      columns: [
        { name: "name", title: "Evaluation", alignment: "left", color: "blue" },
        { name: "score", title: "Score", alignment: "center" },
        { name: "total", title: "Total", alignment: "center" },
        {
          name: "percentage",
          title: "Pass Rate",
          alignment: "right",
          color: "green",
        },
      ],
    });

    for (const evaluation of report.evaluations) {
      const percentage = `${Math.round(evaluation.passRate)}%`;
      summaryTable.addRow({
        name: evaluation.name,
        score: evaluation.score,
        total: evaluation.total,
        percentage: percentage,
      });
    }

    this.console.log(summaryTable.render());

    const detailsTable = new Table({
      title: "📋 Evaluation Details",
      columns: [
        {
          name: "evaluation",
          title: "Evaluation",
          alignment: "left",
          color: "blue",
        },
        { name: "score", title: "Score", alignment: "center" },
        { name: "total", title: "Total", alignment: "center" },
        { name: "comment", title: "Comment", alignment: "left", maxLen: 60 },
      ],
    });

    for (const evaluation of report.evaluations) {
      for (const item of evaluation.items) {
        detailsTable.addRow({
          evaluation: evaluation.name,
          score: item.score,
          total: item.total,
          comment: item.comment || "-",
        });
      }
    }

    this.console.log(detailsTable.render());
  }
}
