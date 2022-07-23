import type { TimePeriod, Transaction } from './types'
import {
  addWeeks,
  addMonths,
  addYears,
  min,
  getYear,
  getMonth,
  lastDayOfYear,
  lastDayOfMonth,
  lastDayOfWeek,
  startOfMonth,
  startOfYear,
  startOfDay,
} from 'date-fns'

interface SummerizedTransacrionPeriod {
  time: { year: number; month?: number }
  totalAmout: number
  type: string
}

interface SummerizedTransacrionsPeriod {
  time: { year: number; month?: number }
  totalAmount: number
  transactions: { type: string; amount: number }[]
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

export function getTransactionsSummeryByPeriod(
  transactions: Transaction[],
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
  let currentDate =
    periodResolution === 'month'
      ? startOfMonth(fromDate)
      : startOfYear(fromDate)
  const getNextDate = getNextIntervalTimeFunc(periodResolution)

  const summarizedTransactionsPeriods: {
    time: { year: number; month?: number }
    totalAmount: number
    transactions: { [type: string]: number }
  }[] = []

  while (
    currentDate.getTime() <= untilDate.getTime() &&
    summarizedTransactionsPeriods.length <= itemsToGenerate + 2
  ) {
    summarizedTransactionsPeriods.push({
      time: extractTimeByPeriod(currentDate, periodResolution),
      totalAmount: 0,
      transactions: {},
    })

    currentDate = getNextDate(currentDate, 1)
  }

  transactions.forEach((transaction) => {
    if (transaction.date.getTime() >= startOfDay(fromDate).getTime()) {
      const transactionTime = JSON.stringify(
        extractTimeByPeriod(transaction.date, periodResolution)
      )

      const relevantPeriod = summarizedTransactionsPeriods.find(
        ({ time }) => JSON.stringify(time) === transactionTime
      )

      if (!!relevantPeriod) {
        relevantPeriod.totalAmount += transaction.amount
        relevantPeriod.transactions[transaction.type] =
          (relevantPeriod.transactions[transaction.type] ?? 0) +
          transaction.amount
      }
    }
  })

  return summarizedTransactionsPeriods.map((period) => ({
    ...period,
    transactions: Object.entries(period.transactions).map(([type, amount]) => ({
      type,
      amount,
    })),
  }))
}
