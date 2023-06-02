import { Telegraf, Context } from 'telegraf'
import { message } from 'telegraf/filters'
import { TELEGRAM_TOKEN } from './config/config'
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

const sendSkills = async (ctx: Context): Promise<undefined> => {
  await ctx.reply('Cargando datos...')

  const res = await getSkills()
  const ranking = getRankingOfSkills(res)
  ranking.sort((a, b) => a.amount - b.amount).reverse()

  const rankingTop = ranking.slice(0, 10)

  let message = ''

  rankingTop.forEach((el, index) => {
    message += `${index + 1} ${el.skill}\nNúmero de ofertas: ${el.amount}\n----------------------------------------------\n`
  })

  await ctx.reply(message)
  return undefined
}

const bot = new Telegraf(typeof TELEGRAM_TOKEN !== 'undefined' ? TELEGRAM_TOKEN : '')

bot.start(async ctx => {
  await ctx.reply(`Buenas ${ctx.update.message.from.first_name}, ¿en que te puedo ayudar?`, {
    reply_markup: {
      inline_keyboard: [[
        { text: '¿Qué puedes hacer?', callback_data: 'get-info' },
        { text: '¿Quién hizo este bot?', callback_data: 'get-dev' }
      ]]
    }
  })
})

bot.help(async ctx => {
  await ctx.reply('Este bot te permitirá saber qué skills són las más utilizadas actualmente en las diferentes ofertas de Infojobs.\n\n/skills -> Top 10 skills')
})

bot.action('get-info', async ctx => {
  await ctx.editMessageText(`Hola ${typeof ctx !== 'undefined' && typeof ctx.from !== 'undefined' ? ctx.from.first_name : ''}, esto es lo que puedo hacer.\n\n/skills -> Top 10 skills más utilizadas.`)
})

bot.action('get-dev', async ctx => {
  await ctx.editMessageText(`Hola ${typeof ctx !== 'undefined' && typeof ctx.from !== 'undefined' ? ctx.from.first_name : ''}, aquí lo tienes.\n\n- https://github.com/ericduart`)
})

bot.on(message('text'), async ctx => {
  if (ctx.update.message.text.includes('/skills')) {
    await sendSkills(ctx)
    return
  }

  await ctx.reply(`Hola ${ctx.from.first_name}, esto es lo que puedo hacer.\n\n/skills -> Top 10 skills más utilizadas.`)
})

bot.launch().catch(err => {
  console.log(err)
  process.exit(1)
})
