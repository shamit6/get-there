import useSWR from 'swr'
import { Mortgage } from 'utils/types'

export default function useMortgages() {
  const { data, mutate, error } = useSWR<Mortgage[]>('/api/mortgages', (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((mortgages: Mortgage[]) => {
        return mortgages.map((mortgage) => ({
          ...mortgage,
          offeringDate: new Date(mortgage.offeringDate),
        }))
      })
  )

  return {
    mortgages: data,
    mutate,
    isLoading: !error && !data,
  }
}
