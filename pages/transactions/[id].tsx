import { useRouter } from 'next/router'
import Form from './Form'
import { TransactionConfig } from '../../utils/types'
import useSWR from 'swr'

function New2() {
  const router = useRouter()

  const { data: transactions } = useSWR<TransactionConfig[]>(
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
    {}
  )

  const transaction = transactions?.find(({ id }) => router.query.id === id)

  return !transaction ? 'Loading' : <Form transactionConfig={transaction!} />
}
export default New2
