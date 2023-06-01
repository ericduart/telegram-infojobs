import { Offers, GeneralOffers, DetailedOffer, OfferWithSkills } from './types'
import axios from 'axios'
const headers = {
  Authorization: 'Basic NDYxOWI0OWZkNTA1NDcxYTg2MTYyNTEyOTliYzAxNzE6REkxVmluVEt1Z0hyd1ZxQXZCWHlXQ3VjNFdjMGVVQUt5d3YzZ0dCOVFVbVNlTVFjZHI='
}

/* const getSkills = async (): Promise<Users[]> => {
  const { data }: { data: Users[] } = await axios('https://jsonplaceholder.typicode.com/comments')

  return data
} */

export const getGeneralOffers = async (page: number, totalResults: number): Promise<GeneralOffers[]> => {
  const { data }: { data: Offers } = await axios(`https://api.infojobs.net/api/9/offer?subcategory=programacion&page=${page}&maxResults=${totalResults}`, { headers })

  return data.offers
}

const getDetailedOffer = async (id: string): Promise<DetailedOffer> => {
  const { data }: { data: DetailedOffer } = await axios(`https://api.infojobs.net/api/7/offer/${id}`, { headers })

  return data
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
