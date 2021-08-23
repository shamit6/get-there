import useSWR from 'swr'
import { BalanceStatus } from '../utils/types'

export default function useBalanceStatus(last?: boolean) {
  const url = `/api/balance-statuses${last ? '?last=true' : ''}`

  const { error, data, mutate } = useSWR(url, (url) =>
    fetch(url)
      .then((r) => r.json())
      .then(([{ createdAt, amount }]) => ({
        createdAt: new Date(createdAt),
        amount,
      }))
  )

  return {
    balanceStatuses: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
