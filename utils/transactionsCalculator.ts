import type {
  Transaction,
  TimePeriod,
  BalanceStatus,
  TimelineTransaction,
} from './types'
import {
  isAfter,
  min,
  isBefore,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns'
import { TransactionConfig } from './types'
import { getNextIntervalTimeFunc } from './timelineTrascationCalc'

function generateTransactionConfigOccurances(
  transactionConfig: TransactionConfig,
  fromDate: Date,
  untilDate: Date
): Transaction[] {
  const { date, type, amount, ...interval } = transactionConfig
  const transactionOccurrences: Transaction[] = []

  if (!interval?.timePeriod) {
    if (isAfter(fromDate, date) || isBefore(untilDate, date)) {
      return []
    } else {
      return [{ amount, type, date }]
    }
  }

  let currentDate = date
  const getNextIntervalTime = getNextIntervalTimeFunc(
    interval!.timePeriod as TimePeriod
  )
  const generateUntilDate = interval!.endDate
    ? min([untilDate, interval!.endDate])
    : untilDate

  while (!isAfter(currentDate, generateUntilDate)) {
    if (!isBefore(currentDate, fromDate)) {
      transactionOccurrences.push({ amount, type, date: currentDate })
    }
    currentDate = getNextIntervalTime(currentDate, interval!.periodAmount!)
  }

  return transactionOccurrences
}

export function generateTransactionConfigsOccurrences(
  transactionConfigs: TransactionConfig[],
  fromDate: Date,
  untilDate: Date
): Transaction[] {
  const transactionConfigsOccurrences = transactionConfigs.flatMap(
    (transactionConfig) =>
      generateTransactionConfigOccurances(
        transactionConfig,
        fromDate,
        untilDate
      )
  )
  return transactionConfigsOccurrences.sort(function compare(t1, t2) {
    return t1.date.getTime() - t2.date.getTime()
  })
}

export function addBalanceToSortTransaction(
  transactions: Transaction[],
  balanceStatus: BalanceStatus
) {
  const transactionsWithBalance: TimelineTransaction[] = []
  const { createdAt, amount } = balanceStatus
  let currentAmount = amount

  transactions.forEach((transaction) => {
    if (!isAfter(transaction.date, createdAt)) {
      transactionsWithBalance.push(transaction)
    } else {
      currentAmount += transaction.amount
      transactionsWithBalance.push({ ...transaction, amount: currentAmount })
    }
  })

  return transactionsWithBalance
}

export function getCurrentMonthBalanceAmount(
  transactions: Transaction[],
  currentDate: Date = new Date()
) {
  const monthStartDate = startOfMonth(currentDate)
  const monthEndDate = endOfMonth(currentDate)
  const currentMonthOccurences = generateTransactionConfigsOccurrences(
    transactions,
    monthStartDate,
    monthEndDate
  )
  const currentMonthBalanceAmount = currentMonthOccurences.reduce(
    (res, cur) => {
      return res + cur.amount
    },
    0
  )
  return currentMonthBalanceAmount
}

export function getCurrentYearBalanceAmount(
  transactions: Transaction[],
  currentDate: Date = new Date()
) {
  const yearStartDate = startOfYear(currentDate)
  const yearEndDate = endOfYear(currentDate)
  const currentYearOccurences = generateTransactionConfigsOccurrences(
    transactions,
    yearStartDate,
    yearEndDate
  )

  const currentYearBalanceAmount = currentYearOccurences.reduce((res, cur) => {
    return res + cur.amount
  }, 0)
  return currentYearBalanceAmount
}

export function getTransactionAmounts(transaction: Transaction[]) {
  const amountToType = transaction.reduce((acc, currTransaction) => {
    const { type, amount } = currTransaction
    if (!acc[type]) {
      return { ...acc, [type]: amount }
    } else {
      return { ...acc, [type]: acc[type] + amount }
    }
  }, {} as Record<string, number>)

  return Object.entries(amountToType).map(([type, amount]) => ({
    type,
    amount,
  }))
}
