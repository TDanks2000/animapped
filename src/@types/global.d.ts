declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISTANCE: string;
      DATABASE_URL: string;
      DISABLE_MAPPING: string;
    }
  }
}
export {};
