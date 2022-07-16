import { addYears } from 'date-fns'
import { useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import type { Transaction } from 'utils/types'

export const DEFAULT_END_DATE = addYears(new Date(), 1)

export default function useFilterOption() {
  const [filter, setFilter] = useLocalStorage<{
    endDate?: number
    targetAmount?: number
  }>('filter-option', { endDate: DEFAULT_END_DATE.getTime() })

  const filterUntilAmount = useCallback(
    (transactions: Transaction[], amount: number) => {
      const transactionsUntilAmount: Transaction[] = [transactions[0]]

      let index = 1

      while (
        index < transactions.length - 1 &&
        transactions[index].amount < amount
      ) {
        transactionsUntilAmount.push(transactions[index])
        index++
      }

      if (
        index === transactions.length &&
        transactions[index].amount < amount
      ) {
        throw new Error('not reach the amount')
      } else {
        transactionsUntilAmount.push(...transactions.slice(index, index + 4))
      }

      return { index, transactionsUntilAmount }
    },
    []
  )

  return {
    filter: {
      ...filter,
      endDate: filter.endDate ? new Date(filter.endDate) : undefined,
    },
    setFilter,
    filterUntilAmount,
  }
}
