import _ from 'lodash'
import { useCallback } from 'react'
import useSWR from 'swr'
import { TransactionConfig } from 'utils/types'

function upsertToTransactionList(
  list: TransactionConfig[],
  transaction: TransactionConfig
) {
  if (!transaction.id) {
    return [...list, transaction]
  } else {
    const a = list.reduce<TransactionConfig[]>((acc, curr) => {
      if (curr.id === transaction.id) {
        return [...acc, transaction]
      } else {
        return [...acc, curr]
      }
    }, [])
    return a
  }
}

export default function useTransactions() {
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
        })
  )

  const deleteTrasaction = useCallback(
    async (transactionId: string) => {
      await mutate((transactionConfigs: TransactionConfig[] = []) => {
        return _.remove(
          transactionConfigs,
          (transaction) => transaction.id !== transactionId
        )
      }, false)

      fetch(`/api/transaction-configs/${transactionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }).then(() => {
        return mutate()
      })
    },
    [mutate]
  )

  const upsertTrasaction = useCallback(
    async (transactionConfig: TransactionConfig) => {
      await mutate(
        async (transactionConfigs = []) => {
          const { id, ...transactionData } = transactionConfig
          const isNewTransaction = !id
          const url = isNewTransaction
            ? '/api/transaction-configs'
            : `/api/transaction-configs/${id}`

          const updatedTransactionConfig = await fetch(url, {
            method: isNewTransaction ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
          }).then((r) => r.json())
          return upsertToTransactionList(transactionConfigs, transactionConfig)
        },
        {
          optimisticData: (transactionConfigs = []) => {
            return upsertToTransactionList(
              transactionConfigs,
              transactionConfig
            )
          },
          populateCache: false,
          rollbackOnError: true,
        }
      )
    },
    []
  )

  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    deleteTrasaction,
    upsertTrasaction,
  }
}
