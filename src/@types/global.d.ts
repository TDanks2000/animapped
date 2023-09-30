declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISTANCE: string;
      DISABLE_MAPPING: string;
      DATABASE_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
    }
  }
}
export {};
