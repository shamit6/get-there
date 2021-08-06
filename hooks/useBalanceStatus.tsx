import useSWR from 'swr'
import { BalanceStatus } from '../utils/types'

export default function useBalanceStatus(last?: boolean) {

  let url = '/api/balance-statuses'
  if (last) {
    url += '?last=true'
  }
  const { error, data, mutate } = useSWR(
    url,
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then(({ createdAt, amount }) => ({
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
