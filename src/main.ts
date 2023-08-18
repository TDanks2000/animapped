import { Mapping } from "./mapping";

class Main {
  constructor() {
    console.log("Hello World");
  }

  async startMapping() {
    const mapping = await Mapping.create();
    await mapping.start();
  }
}

(async () => {
  const main = new Main();

  main.startMapping();
})();
