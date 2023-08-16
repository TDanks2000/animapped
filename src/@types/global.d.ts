declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISTANCE: string;
      DATABASE_URL: string;
    }
  }
}
export {};
