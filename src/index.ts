import { Telegraf } from 'telegraf'
// import { message } from 'telegraf/filters'
import { TELEGRAM_TOKEN, getUserId } from './config/config'
import getSkills from './api/infojobs'
import { CountSkills } from './types'
import { OfferWithSkills } from './api/types'

function getRankingOfSkills (arrSkills: OfferWithSkills[]): CountSkills[] {
  const totalSkills: CountSkills[] = []

  arrSkills.forEach(el => {
    const skills = el.skillsList.map(skill => skill.skill)

    skills.forEach(skill => {
      const skillFound = totalSkills.find(skillData => skillData.skill.toLowerCase() === skill.toLowerCase())

      if (typeof skillFound === 'undefined') {
        totalSkills.push({ skill: skill.toLowerCase(), amount: 1 })
      } else {
        skillFound.amount++
      }
    })
  })

  return totalSkills
}

const checkUserId = (userId: number): Boolean => {
  return typeof getUserId() !== 'undefined' && userId === getUserId()
}

const bot = new Telegraf(typeof TELEGRAM_TOKEN !== 'undefined' ? TELEGRAM_TOKEN : '')

bot.use(async (ctx, next) => {
  if (typeof ctx.message?.from.id !== 'undefined' && checkUserId(ctx.message.from.id) === true) {
    await next()
  } else {
    await ctx.reply('Este bot es privado')
  }
})

bot.start(async ctx => {
  if (checkUserId(ctx.message.from.id) === false) {
    await ctx.reply('Lo siento, este bot es privado.')
    return
  }

  await ctx.reply('en que te ayudo', {
    reply_markup: {
      inline_keyboard: [[
        { text: '¿Qué me permite hacer este bot?', callback_data: 'get-info' }
      ]]
    }
  })
})

bot.help(async ctx => {
  await ctx.reply('Comandos disponibles:\n\n/skills -> Devuelve el top 10 skills más utilizadas.')
})

bot.on('message', async ctx => {
  if (checkUserId(ctx.message.from.id) === false) await ctx.reply('Lo siento, este bot es privado.')
})

bot.command('/skills', async ctx => {
  await ctx.reply('Cargando datos...')

  const res = await getSkills()
  const ranking = getRankingOfSkills(res)
  ranking.sort((a, b) => a.amount - b.amount).reverse()

  const rankingTop = ranking.slice(0, 10)

  let message = ''

  rankingTop.forEach((el, index) => {
    message += `[+] ${index + 1}\nSkill: ${el.skill}\nNúmero de ofertas: ${el.amount}\n----------------------------------------------\n`
  })

  await ctx.reply(message)
})

bot.action('get-info', async ctx => {
  await ctx.editMessageReplyMarkup(undefined)
  await ctx.editMessageText('Este bot te permitirá saber qué skills són las más utilizadas actualmente en las diferentes ofertas de Infojobs\n\n/skills -> Top 10 skills')
})

bot.launch().catch(err => {
  console.log(err)
  process.exit(1)
})
