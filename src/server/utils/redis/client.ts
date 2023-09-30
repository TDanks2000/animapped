import Console from "@tdanks2000/fancyconsolelog";
import Redis from "ioredis";

const console = new Console();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  db: 1,
});

redis.on("connect", () => {
  console.info("⚡ Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error: ", err);
});

export default redis;
