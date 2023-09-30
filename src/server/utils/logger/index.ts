import Console from "@tdanks2000/fancyconsolelog";
import { FastifyPluginCallback } from "fastify";
const console = new Console();
import fp from "fastify-plugin";
import { isObjEmpty } from "../utils";

type Log = {
  method: string;
  url: string;
  ip: string;
  query?: any;
  params?: any;
  body?: any;
  [x: string]: unknown;
};

const Logger: FastifyPluginCallback = (fastify, options, next) => {
  fastify.addHook("onRequest", (request, reply, done) => {
    // Log custom information for each request
    let ip: string =
      (request.headers["cf-connecting-ip"] as string) ??
      (request.headers["x-forwarded-for"] as string) ??
      request.ip;

    const log: Log = {
      method: request.method,
      url: request.url,
      ip,
    };

    if (!isObjEmpty(request.query!)) log.query = request.query;
    if (!isObjEmpty(request.params!)) log.params = request.params;
    if (!isObjEmpty(request.body!)) log.body = request.body;

    console.info(JSON.stringify(log, null, 2));

    done();
  });

  fastify.addHook("onReady", () => {
    console.info("Server is ready ");
  });

  next();
};

export default fp(Logger, { name: "Logger" });
