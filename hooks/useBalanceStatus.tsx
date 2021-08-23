import useSWR from 'swr'
import { BalanceStatus } from '../utils/types'

export default function useBalanceStatus(last?: boolean) {
  const url = `/api/balance-statuses${last ? '?last=true' : ''}`

  const { error, data, mutate } = useSWR<BalanceStatus[]>(url, (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((r: BalanceStatus[]) =>
        r.map(({ createdAt, ...rest }) => ({
          createdAt: new Date(createdAt),
          ...rest,
        }))
      )
  )

  return {
    balanceStatuses: data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
