declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_BOT_TOKEN: string
      INFOJOBS_TOKEN: string
    }
  }
}

export {}
