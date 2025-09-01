export abstract class ConsoleDecisionPresenter {
  constructor(private readonly console: Console) {}

  render(decision: Record<string, any>): void {
    this.console.log(JSON.stringify(decision));
  }
}
