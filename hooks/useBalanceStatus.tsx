import useSWR, { mutate } from 'swr'
import { BalanceStatus } from 'utils/types'

export default function useBalanceStatus(last?: boolean) {
  const url = '/api/balance-statuses'
  // const url = `/api/balance-statuses${last ? '?last=true' : ''}`

  const { error, data } = useSWR<BalanceStatus[]>(url, (url) =>
    fetch(url)
      .then((r) => r.json())
      .then((r: BalanceStatus[]) =>
        r.map(({ createdAt, ...rest }) => ({
          createdAt: new Date(createdAt),
          ...rest,
        }))
      )
  )

  const updateBalanceStatus = async (amount: number) => {
    const optimisticData = [{ amount, createdAt: new Date() }, ...(data || [])]

    mutate(
      url,
      async () => {
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        })
        const [newBalance] = await response.json()

        return [
          {
            amount: newBalance.amount,
            createdAt: new Date(newBalance.createdAt),
          },
          ...(data || []),
        ]
      },
      {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false
      }
    )
  }

  return {
    balanceStatuses: last ? data?.slice(0, 1) : data,
    isLoading: !error && !data,
    error,
    updateBalanceStatus,
  }
}
