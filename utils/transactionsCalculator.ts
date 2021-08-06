import type {
  Transaction,
  TimePeriod,
  BalanceStatus,
  TimelineTransaction,
} from './types'
import { addWeeks, addMonths, addYears, isAfter, min, isBefore } from 'date-fns'
import { TransactionConfig as TransactionConfigPrisma} from '@prisma/client'
import { TransactionConfig } from './types'

function getNextIntervalTimeFunc(
  timePeriod: TimePeriod
): (date: Date | number, amount: number) => Date {
  switch (timePeriod) {
    case 'week':
      return addWeeks
    case 'month':
      return addMonths
    default:
      return addYears
  }
}

function generateTransactionConfigOccurances(
  transactionConfig: TransactionConfig,
  fromDate: Date,
  untilDate: Date
): Transaction[] {
  const { date, type, amount, ...interval } = transactionConfig
  const transactionOccurances: Transaction[] = []

  if (!interval?.timePeriod && !isBefore(date, fromDate) && !isAfter(date, untilDate)) {
    return [{ amount, type, date }]
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
      generateTransactionConfigOccurances(transactionConfig, fromDate, untilDate)
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
      transactionsWithBalance.push({ ...transaction, balance: currentAmount })
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
  
  
  const transactionsWithBlance = addBalanaceToSortTransaction(
    transactionsUntilNow,
    lastBalanceStatus
    )

  return transactionsWithBlance[transactionsWithBlance.length - 1].balance!
}
