import { getTransactionConfigs } from 'db/transactionConfigs'
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
    const index = list.findIndex((t) => t.id === transaction.id)
    if (index === -1) {
      return [...list, transaction]
    } else {
      return [...list.slice(0, index), transaction, ...list.slice(index + 1)]
    }
  }
}

export default function useTransactions() {
  const { data, error, mutate } = useSWR<TransactionConfig[]>(
    '/api/transaction-configs',

    getTransactionConfigs
  )

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      await mutate(
        async (transactionConfigs: TransactionConfig[] = []) => {
          await fetch(`/api/transaction-configs/${transactionId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          })

          return transactionConfigs.filter(({ id }) => id === transactionId)
        },
        {
          populateCache: false,
          rollbackOnError: true,
          optimisticData: (transactionConfigs: TransactionConfig[] = []) => {
            return transactionConfigs.filter(({ id }) => id !== transactionId)
          },
        }
      )
    },
    [mutate]
  )

  const upsertTransaction = useCallback(
    async (transactionConfig: Partial<TransactionConfig>) => {
      await mutate(
        async () => {
          const { id, ...transactionData } = transactionConfig
          const isNewTransaction = !id
          const url = isNewTransaction
            ? '/api/transaction-configs'
            : `/api/transaction-configs/${id}`

          const updatedTransactionConfig = await fetch(url, {
            method: isNewTransaction ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
          })
            .then((r) => r.json())
            .then(({ date, endDate, ...rest }) => ({
              ...rest,
              date: new Date(date),
              endDate: endDate ? new Date(endDate) : null,
            }))

          return upsertToTransactionList(
            data || [],
            updatedTransactionConfig
          ) as TransactionConfig[]
        },
        {
          optimisticData: (transactionConfigs = []) => {
            return upsertToTransactionList(
              transactionConfigs,
              transactionConfig as TransactionConfig
            ) as TransactionConfig[]
          },
          populateCache: true,
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
    deleteTransaction,
    upsertTransaction,
  }
}
