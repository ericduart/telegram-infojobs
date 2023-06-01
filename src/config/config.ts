import { config } from 'dotenv'
config()

export const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

const TELEGRAM_USER_ID = process.env.TELEGRAM_USER_ID

export const getUserId = (): Number | undefined => {
  return !isNaN(Number(TELEGRAM_USER_ID)) ? Number(TELEGRAM_USER_ID) : undefined
}
