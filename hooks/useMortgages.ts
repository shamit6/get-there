import { useCallback } from 'react'
import useSWR from 'swr'
import type { Mortgage } from 'utils/types'

function upsertToMortgageList(list: Mortgage[], mortgage: Mortgage) {
  if (!mortgage.id) {
    return [...list, mortgage]
  } else {
    const index = list.findIndex((t) => t.id === mortgage.id)
    if (index === -1) {
      return [...list, mortgage]
    } else {
      return [...list.slice(0, index), mortgage, ...list.slice(index + 1)]
    }
  }
}

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

  const upsertMortgage = useCallback(
    async (mortgage: Mortgage) => {
      await mutate(
        async () => {
          const { id, ...transactionData } = mortgage
          const isNewMortgage = !id
          const url = isNewMortgage ? '/api/mortgages' : `/api/mortgages/${id}`

          const upsertedMortgage = await fetch(url, {
            method: isNewMortgage ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
          })
            .then((r) => r.json())
            .then(({ offeringDate, ...rest }) => ({
              ...rest,
              offeringDate: new Date(offeringDate),
            }))

          return upsertToMortgageList(data || [], upsertedMortgage)
        },
        {
          optimisticData: (mortgages = []) => {
            return upsertToMortgageList(mortgages, mortgage)
          },
          populateCache: true,
          rollbackOnError: true,
        }
      )
    },
    [mutate, data]
  )

  const deleteMortgage = useCallback(
    async (mortgageId: string) => {
      await mutate(
        async (mortgages = []) => {
          await fetch(`/api/mortgages/${mortgageId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          })
          return mortgages.filter((mortgage) => mortgage.id === mortgageId)
        },
        {
          populateCache: false,
          rollbackOnError: true,
          optimisticData: (mortgages = []) => {
            return mortgages.filter((mortgage) => mortgage.id === mortgageId)
          },
        }
      )
    },
    [mutate]
  )

  return {
    mortgages: data,
    upsertMortgage,
    deleteMortgage,
    isLoading: !error && !data,
  }
}
