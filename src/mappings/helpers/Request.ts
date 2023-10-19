import Console from "@tdanks2000/fancyconsolelog";
import { Proxy } from "../@types";
import { Proxies, proxy } from "../utils";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const console = new Console();

type RequestConfig = {
  url: string;
  use_proxy: boolean;
  config?: AxiosRequestConfig;
};

export class Request {
  controller: AbortController = new AbortController();
  proxies: Proxies = proxy;

  async request({
    url,
    use_proxy,
    config = {},
  }: RequestConfig): Promise<AxiosResponse | undefined> {
    return new Promise(async (resolve, reject) => {
      try {
        let proxy: Proxy | undefined;

        if (use_proxy) {
          await this.proxies.update();
          proxy = this.proxies.getRandomProxy();
        }

        const timeout = setTimeout(() => {
          const proxy_to_remove = !proxy ? undefined : `${proxy.host}:${proxy?.port}`;
          if (proxy && proxy_to_remove) this.proxies.renove(proxy_to_remove);

          this.controller.abort();
        }, 10000);

        this.controller.signal.addEventListener("abort", () => {
          console.error(`${url} aborted.`);

          return undefined;
        });

        let req;
        try {
          req = axios
            .request({
              url: url,
              ...config,
              proxy: proxy,
              signal: this.controller.signal,
            })
            .catch((err) => {
              console.log(err.message);
              return err;
            });
        } catch (error) {
          const err = error as Error;
          throw new Error(`Request Error: ${err.message}`);
        }

        clearTimeout(timeout);
        return resolve(req);
      } catch (error) {
        const err = error as Error;
        throw new Error(`Request Error: ${err.message}`);
      }
    });
  }
}
// (async () => {
//   const req = new Request();
//   const data = await req.request({
//     url: "https://mangasee123.com/",
//     use_proxy: true,
//   });

//   if (!data) console.info("Error");
// })();
