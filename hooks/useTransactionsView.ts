import { addMonths, isBefore } from 'date-fns'
import { generateMortgageTransactionsOccurrences } from 'utils/amortizationScheduleCalculator'
import {
  addBalanceToSortTransaction,
  generateAssetsTransactionsOccurrences,
  generateTransactionConfigsOccurrences,
} from 'utils/transactionsCalculator'
import { Transaction } from 'utils/types'
import useBalanceStatus from './useBalanceStatus'
import useFilterOptions from './useFilterOptions'
import useMortgages from './useMortgages'
import useTransactions from './useTransactions'
import useAssets from './useAssets'

export default function useTransactionsView() {
  const { balanceStatuses } = useBalanceStatus()
  const { transactions = [] } = useTransactions()
  const { mortgages = [] } = useMortgages()
  const { assets = [] } = useAssets()
  const nowDate = new Date()

  const {
    filter: { endDate, targetAmount },
    filterUntilAmount,
  } = useFilterOptions()

  if (!balanceStatuses || balanceStatuses.length === 0) {
    return {
      transactionsWithBalanceToView: [],
      transactionsToView: [],
      currentBalanceAmount: 0,
    }
  }

  const lastBalanceStatus = balanceStatuses?.[0]

  const allTransactionsOccurrences = generateTransactionConfigsOccurrences(
    transactions,
    lastBalanceStatus.createdAt,
    endDate ?? addMonths(nowDate, 30 * 12 + 4)
  )
    ?.concat(
      generateMortgageTransactionsOccurrences(
        mortgages,
        lastBalanceStatus.createdAt,
        endDate ?? addMonths(nowDate, 30 * 12 + 4)
      )
    )
    ?.concat(
      generateAssetsTransactionsOccurrences(
        assets,
        lastBalanceStatus.createdAt,
        endDate ?? addMonths(nowDate, 30 * 12 + 4)
      )
    )
    ?.sort(function compare(t1, t2) {
      return t1.date.getTime() - t2.date.getTime()
    })

  const transactionsWithBalance = addBalanceToSortTransaction(
    allTransactionsOccurrences,
    lastBalanceStatus
  )

  const currentBalanceIndex = transactionsWithBalance.findIndex(
    ({ date }) => !isBefore(date, nowDate)
  )
  const currentBalanceAmount =
    currentBalanceIndex > 0
      ? transactionsWithBalance[currentBalanceIndex - 1].amount
      : lastBalanceStatus!.amount

  let transactionsWithBalanceToView: Transaction[] = []
  let targetAmountIndex

  if (targetAmount) {
    try {
      const { index, transactionsUntilAmount } = filterUntilAmount(
        transactionsWithBalance,
        targetAmount
      )
      targetAmountIndex = index
      transactionsWithBalanceToView = transactionsUntilAmount
    } catch {
      transactionsWithBalanceToView = transactionsWithBalance
    }
  } else {
    transactionsWithBalanceToView = transactionsWithBalance.filter(
      ({ date }) => date.getTime() >= lastBalanceStatus.createdAt.getTime()
    )

    if (lastBalanceStatus.createdAt.getTime() !== endDate?.getTime()) {
      transactionsWithBalanceToView.push({
        ...transactionsWithBalanceToView[
          transactionsWithBalanceToView.length - 1
        ],
        date: endDate!,
      })
    }
  }
  const transactionsToView = allTransactionsOccurrences.slice(
    0,
    transactionsWithBalanceToView.length
  )

  return {
    transactionsWithBalanceToView,
    transactionsToView,
    targetAmountIndex,
    currentBalanceAmount,
  }
}
