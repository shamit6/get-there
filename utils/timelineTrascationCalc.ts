import type { TimePeriod } from './types'
import {
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  min,
  isBefore,
  getYear,
  getMonth,
  lastDayOfYear,
  lastDayOfMonth,
  lastDayOfWeek,
} from 'date-fns'
import { TransactionConfig } from './types'

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

export function getNextIntervalTimeFunc(
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

function getLastDayOfPeriodByDate(
  timePeriod: TimePeriod,
  amountOfPeriods: number,
  fromDate: Date
): Date {
  switch (timePeriod) {
    case 'week':
      return lastDayOfWeek(addWeeks(fromDate, amountOfPeriods))
    case 'month':
      return lastDayOfMonth(addMonths(fromDate, amountOfPeriods))
    default:
      return lastDayOfYear(addYears(fromDate, amountOfPeriods))
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
  const transactionOccurrences: SummerizedTransacrionPeriod[] = []

  if (!interval?.timePeriod) {
    if (isAfter(fromDate, date) || isBefore(untilDate, date)) {
      return []
    } else {
      return [
        {
          time: extractTimeByPeriod(date, periodResolution),
          totalAmout: amount,
          type,
        },
      ]
    }
  }

  let currentDate = getFirstOccuranceNotBefore(transactionConfig, fromDate)
  let currentTransactionSummrey = {
    time: extractTimeByPeriod(currentDate, periodResolution),
    totalAmout: 0,
    type,
  }
  let isAnythingToPush = false

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
        isAnythingToPush = true
      } else {
        transactionOccurrences.push(currentTransactionSummrey)
        currentTransactionSummrey = {
          time: extractTimeByPeriod(currentDate, periodResolution),
          totalAmout: amount,
          type,
        }
        isAnythingToPush = !isAfter(currentDate, generateUntilDate)
      }
    }
    currentDate = getNextIntervalTime(currentDate, interval!.periodAmount!)
  }

  if (isAnythingToPush) {
    transactionOccurrences.push(currentTransactionSummrey)
  }

  return transactionOccurrences
}

export function getTransactionsSummeryByPeriod(
  transactionConfigs: TransactionConfig[],
  periodResolution: TimePeriod,
  itemsToGenerate: number,
  fromDate: Date = new Date(),
  maxDate?: Date
): SummerizedTransacrionsPeriod[] {
  const lastDayOfPeriod = getLastDayOfPeriodByDate(
    periodResolution,
    itemsToGenerate,
    fromDate
  )

  const untilDate = !maxDate ? lastDayOfPeriod : min([maxDate, lastDayOfPeriod])

  const transactionConfigsOccurrences = transactionConfigs.flatMap(
    (transactionConfig) =>
      getTransactionSummery(
        transactionConfig,
        fromDate,
        untilDate,
        periodResolution
      )
  )
  transactionConfigsOccurrences.sort(function compare(t1, t2) {
    const subYears = t1.time.year - t2.time.year
    return subYears ? subYears : (t1.time.month || 0) - (t2.time.month || 0)
  })

  return transactionConfigsOccurrences.reduce((acc, curr) => {
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
      return lastDayOfYear(new Date(time.year, 0))
    default:
      return lastDayOfMonth(new Date(time.year, time.month!))
  }
}
