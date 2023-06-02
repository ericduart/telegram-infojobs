import { Offers, GeneralOffers, DetailedOffer, OfferWithSkills } from './types'
import { INFOJOBS_TOKEN } from '../config/config'
const headers = {
  Authorization: `Basic ${INFOJOBS_TOKEN}`
}

export const getGeneralOffers = async (page: number, totalResults: number): Promise<GeneralOffers[]> => {
  const res = await fetch(`https://api.infojobs.net/api/9/offer?subcategory=programacion&page=${page}&maxResults=${totalResults}`, { headers })
  const data: Offers = await res.json()

  return data.offers
}

const getDetailedOffer = async (id: string): Promise<DetailedOffer> => {
  const res = await fetch(`https://api.infojobs.net/api/7/offer/${id}`, { headers })
  return await res.json()
}

const getSkills = async (): Promise<OfferWithSkills[]> => {
  const offersWithSkills: OfferWithSkills[] = []

  for (let i = 1; i <= 4; i++) {
    const offers = await getGeneralOffers(i, 50)

    const arrIds = offers.map(el => el.id)

    for (let j = 0; j < arrIds.length; j++) {
      const detailedOffer = await getDetailedOffer(arrIds[j])
      offersWithSkills.push({
        skillsList: detailedOffer.skillsList,
        title: detailedOffer.title,
        id: detailedOffer.id
      })
    }
  }

  return offersWithSkills
}

export default getSkills
