import useSWR from 'swr'
import { TransactionConfig } from '../../utils/types'

export default function useTransaction() {
  const { data, error, mutate } = useSWR<TransactionConfig[]>(
    '/api/transaction-configs',
    (url) =>
      fetch(url)
        .then((r) => r.json())
        .then((transactionConfigs: TransactionConfig[]) => {
          return transactionConfigs.map(({ date, endDate, ...rest }) => ({
            ...rest,
            date: new Date(date),
            endDate: endDate ? new Date(endDate) : undefined,
          }))
        }),
    { refreshInterval: 0 }
  )

  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
