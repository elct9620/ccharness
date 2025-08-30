export abstract class ConsoleDecisionPresenter {
  render(decision: Record<string, any>): void {
    console.log(JSON.stringify(decision));
  }
}
