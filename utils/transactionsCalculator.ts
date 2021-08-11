import type {
  Transaction,
  TimePeriod,
  BalanceStatus,
  TimelineTransaction,
} from './types'
import {
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  min,
  isBefore,
  startOfMonth,
  getYear,
  getMonth,
  lastDayOfYear,
  lastDayOfMonth,
} from 'date-fns'
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

  if (
    !interval?.timePeriod &&
    !isBefore(date, fromDate) &&
    !isAfter(date, untilDate)
  ) {
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

  if (transactionsUntilNow.length === 0) {
    return lastBalanceStatus.amount
  }

  const transactionsWithBlance = addBalanaceToSortTransaction(
    transactionsUntilNow,
    lastBalanceStatus
  )

  return transactionsWithBlance[transactionsWithBlance.length - 1].balance!
}

///////////////// new
interface SummerizedTransacrionPeriod {
  time: { year: number; month?: number }
  totalAmout: number
  type: string
}

interface SummerizedTransacrionsPeriod {
  time: { year: number; month?: number }
  totalAmount: number
  transaction: { type: string; amount: number }[]
}

export interface TimelineSummerizedTransacrionsPeriod
  extends SummerizedTransacrionsPeriod {
  amountWithBalance?: number
}

function getPreiodTimeFunc(
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

function getFirstOccuranceNotBefore(
  transactionConfig: TransactionConfig,
  notBeforeDate: Date
): Date {
  const getNextIntervalTime = getNextIntervalTimeFunc(
    transactionConfig.timePeriod as TimePeriod
  )
  let currDate = transactionConfig.date

  while (isBefore(currDate, notBeforeDate)) {
    currDate = getNextIntervalTime(currDate, transactionConfig.periodAmount!)
  }

  return currDate
}

function extractTimeByPeriod(
  date: Date,
  periodResolution: TimePeriod
): { year: number; month?: number } {
  switch (periodResolution) {
    case 'year':
      return { year: getYear(date) }
    default:
      return { year: getYear(date), month: getMonth(date) }
  }
}

function getTransactionSummery(
  transactionConfig: TransactionConfig,
  fromDate: Date,
  untilDate: Date,
  periodResolution: TimePeriod
): SummerizedTransacrionPeriod[] {
  const { date, type, amount, ...interval } = transactionConfig
  const transactionOccurances: SummerizedTransacrionPeriod[] = []

  if (
    !interval?.timePeriod &&
    !isBefore(date, fromDate) &&
    !isAfter(date, untilDate)
  ) {
    return [
      {
        time: extractTimeByPeriod(date, periodResolution),
        totalAmout: amount,
        type,
      },
    ]
  }

  let currentDate = getFirstOccuranceNotBefore(transactionConfig, fromDate)
  let currentTransactionSummrey = {
    time: extractTimeByPeriod(currentDate, periodResolution),
    totalAmout: 0,
    type,
  }

  const getNextIntervalTime = getNextIntervalTimeFunc(
    interval!.timePeriod as TimePeriod
  )
  const generateUntilDate = interval!.endDate
    ? min([untilDate, interval!.endDate])
    : untilDate

  while (!isAfter(currentDate, generateUntilDate)) {
    if (!isBefore(currentDate, fromDate)) {
      if (
        JSON.stringify(currentTransactionSummrey.time) ===
        JSON.stringify(extractTimeByPeriod(currentDate, periodResolution))
      ) {
        currentTransactionSummrey.totalAmout += amount
      } else {
        transactionOccurances.push(currentTransactionSummrey)
        currentTransactionSummrey = {
          time: extractTimeByPeriod(currentDate, periodResolution),
          totalAmout: amount,
          type,
        }
      }
    }
    currentDate = getNextIntervalTime(currentDate, interval!.periodAmount!)
  }

  return transactionOccurances
}

export function getTransactionsSummeryByPeriod(
  transactionConfigs: TransactionConfig[],
  periodResolution: TimePeriod,
  itemsToGenerate: number,
  fromDate: Date = new Date()
): SummerizedTransacrionsPeriod[] {
  const addPriodTimeFunc = getPreiodTimeFunc(periodResolution)
  const untillDate = startOfMonth(addPriodTimeFunc(fromDate, itemsToGenerate))

  const transactionConfigsOccurances = transactionConfigs.flatMap(
    (transactionConfig) =>
      getTransactionSummery(
        transactionConfig,
        fromDate,
        untillDate,
        periodResolution
      )
  )
  transactionConfigsOccurances.sort(function compare(t1, t2) {
    const subYears = t1.time.year - t2.time.year
    return subYears ? subYears : (t1.time.month || 0) - (t2.time.month || 0)
  })

  return transactionConfigsOccurances.reduce((acc, curr) => {
    const last = acc[acc.length - 1]

    if (JSON.stringify(last?.time) !== JSON.stringify(curr.time)) {
      acc.push({
        time: curr.time,
        totalAmount: curr.totalAmout,
        transaction: [{ type: curr.type, amount: curr.totalAmout }],
      })

      return acc
    } else {
      const updatedLast = {
        time: last.time,
        totalAmount: last.totalAmount + curr.totalAmout,
        transaction: [
          ...last.transaction,
          { type: curr.type, amount: curr.totalAmout },
        ],
      }
      return [...acc.slice(0, acc.length - 1), updatedLast]
    }
  }, [] as SummerizedTransacrionsPeriod[])
}

export function addBalanaceAmountToTransactionsSummery(
  transactions: SummerizedTransacrionsPeriod[],
  balanceAmount: number
) {
  const transactionsWithBalance: TimelineSummerizedTransacrionsPeriod[] = []
  let currentAmount = balanceAmount

  transactions.forEach((transaction) => {
    currentAmount += transaction.totalAmount
    transactionsWithBalance.push({
      ...transaction,
      amountWithBalance: currentAmount,
    })
  })

  return transactionsWithBalance
}

export function getLastDayOfPeriod(
  time: { year: number; month?: number },
  periodResolution: TimePeriod
): Date {
  switch (periodResolution) {
    case 'year':
      return lastDayOfYear(new Date(time.year, 0, 0))
    default:
      return lastDayOfMonth(new Date(time.year, time.month!, 0))
  }
}
