import axios from "axios";
import { Proxy } from "../../@types";

class Proxies {
  private protocol: "http" | "https" = "http";
  proxies: Set<string> = new Set();

  constructor() {}

  private async get(): Promise<string[]> {
    const url = `https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/${this.protocol}.txt`;

    const { data } = await axios.get(url);
    const proxies = data.split("\n");

    return proxies;
  }

  async update() {
    const proxies = await this.get();
    this.proxies = new Set(proxies);
  }

  async start() {
    await this.update();
    setInterval(async () => {
      await this.update();
    }, 1000 * 60 * 60 * 5);
  }

  getRandomProxy(): Proxy {
    let items = Array.from(this.proxies);
    const proxy = items[Math.floor(Math.random() * items.length)];

    const host = proxy.split(":")[0];
    const port = parseInt(proxy.split(":")[1]);

    return `${this.protocol}://${proxy}`;
  }
}

export { Proxies };
