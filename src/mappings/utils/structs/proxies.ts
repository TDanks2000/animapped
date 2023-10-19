import axios from "axios";
import { Proxy } from "../../@types";
import ms from "ms";

class Proxies {
  private protocol: "http" | "https" = "http";
  proxies: Set<string> = new Set();

  constructor() {
    setInterval(async () => {
      await this.update();
    }, ms("5 hours"));
  }

  private async get(): Promise<string[]> {
    const url = `https://raw.githubusercontent.com/prxchk/proxy-list/main/${this.protocol}.txt`;

    const { data } = await axios.get(url);
    const proxies = data.split("\n");

    return proxies;
  }

  async update() {
    const proxies = await this.get();
    this.proxies = new Set(proxies);
  }

  getRandomProxy(): Proxy {
    let items = Array.from(this.proxies);
    const proxy = items[Math.floor(Math.random() * items.length)];

    const ip = proxy.split(":")[0];
    const port = proxy.split(":")[1];

    return {
      host: ip,
      port: parseInt(port),
      protocol: this.protocol,
    };
  }

  async renove(proxy: string) {
    this.proxies.delete(proxy);
  }
}

const proxy = new Proxies();

export { proxy, Proxies };
