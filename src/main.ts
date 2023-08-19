import figlet from "figlet";
import { Mapping } from "./mapping";
import Console from "@tdanks2000/fancyconsolelog";

const c = new Console();
class Main {
  constructor() {
    figlet.text(
      "AniMapped",
      {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
        whitespaceBreak: true,
      },
      function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }

        c.setColor("yellowBright");
        c.log(data);
        console.log("\n");
      }
    );
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
