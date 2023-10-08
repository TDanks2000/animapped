export class StateManager {
  public running: boolean = false;
  public paused: boolean = false;

  public start() {
    this.running = true;
    this.paused = false;
  }

  public stop() {
    this.running = false;
    this.paused = false;
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
  }
}
