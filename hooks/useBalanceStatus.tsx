import useSWR, { mutate } from 'swr'
import { BalanceStatus } from 'utils/types'

export default function useBalanceStatus(last?: boolean) {
  const url = `/api/balance-statuses${last ? '?last=true' : ''}`

  const { error, data } = useSWR<BalanceStatus[]>(url, (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((r: BalanceStatus[]) =>
        r.map(({ createdAt, ...rest }) => ({
          createdAt: new Date(createdAt),
          ...rest,
        }))
      ),
      {refreshInterval: 5000}
  )

  const updateBalanceStatus = async (amount: number) => {
    await mutate(
      '/api/balance-statuses',
      (balanceStatuses: BalanceStatus[]) =>
        balanceStatuses
          ? balanceStatuses.concat({ amount, createdAt: new Date() })
          : [{ amount, createdAt: new Date() }],
      false
    )
    await mutate(
      '/api/balance-statuses?last=true',
      () => [{ amount, createdAt: new Date() }],
      false
    )

    await fetch('/api/balance-statuses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
  }

  return {
    balanceStatuses: data,
    isLoading: !error && !data,
    error,
    updateBalanceStatus,
  }
}
