declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    TOKEN: string;
    GUILD_ID?: string;
    CLIENT_ID: string;
    DATABASE_URL: string;
    REDIS_URL?: string;
  }
}
