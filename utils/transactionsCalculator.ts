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
  const transactionOccurances: Transaction[] = []

  if (!interval?.timePeriod) {
    if (!isBefore(date, fromDate) || !isAfter(date, untilDate)) {
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
      transactionOccurances.push({ amount, type, date: currentDate })
    }
    currentDate = getNextIntervalTime(currentDate, interval!.periodAmount!)
  }

  return transactionOccurances
}

export function generateTransactionConfigsOccurances(
  transactionConfigs: TransactionConfig[],
  fromDate: Date,
  untilDate: Date
): Transaction[] {
  const transactionConfigsOccurances = transactionConfigs.flatMap(
    (transactionConfig) =>
      generateTransactionConfigOccurances(
        transactionConfig,
        fromDate,
        untilDate
      )
  )
  return transactionConfigsOccurances.sort(function compare(t1, t2) {
    return t1.date.getTime() - t2.date.getTime()
  })
}

export function addBalanaceToSortTransaction(
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

export function calcCurrentBalanceAmount(
  transactionConfigs: TransactionConfig[],
  lastBalanceStatus: BalanceStatus
): number {
  if (transactionConfigs.length === 0) {
    return lastBalanceStatus.amount
  }

  const transactionsUntilNow = generateTransactionConfigsOccurances(
    transactionConfigs,
    lastBalanceStatus.createdAt,
    new Date()
  )

  if (transactionsUntilNow.length === 0) {
    return lastBalanceStatus.amount
  }

  const transactionsWithBlance = addBalanaceToSortTransaction(
    transactionsUntilNow,
    lastBalanceStatus
  )

  return transactionsWithBlance[transactionsWithBlance.length - 1].amount!
}

export function getCurrentMonthBalanceAmount(
  transactions: Transaction[],
  currentDate: Date = new Date()
) {
  const monthStartDate = startOfMonth(currentDate)
  const monthEndDate = endOfMonth(currentDate)
  const currentMonthOccurences = generateTransactionConfigsOccurances(
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
  const currentYearOccurences = generateTransactionConfigsOccurances(
    transactions,
    yearStartDate,
    yearEndDate
  )

  const currentYearBalanceAmount = currentYearOccurences.reduce((res, cur) => {
    return res + cur.amount
  }, 0)
  return currentYearBalanceAmount
}

export function getTransactionConfigsAmounts(
  transactionConfigs: TransactionConfig[],
  fromDate: Date,
  untilDate: Date
) {
  const occureces = generateTransactionConfigsOccurances(
    transactionConfigs,
    fromDate,
    untilDate
  )

  const amountToType = occureces.reduce((acc, currTransaction) => {
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
