declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_BOT_TOKEN: string
      TELEGRAM_USER_ID: string
    }
  }
}

export {}
