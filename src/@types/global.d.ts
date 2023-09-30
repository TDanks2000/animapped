declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISTANCE: string;
      DATABASE_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}
export {};
