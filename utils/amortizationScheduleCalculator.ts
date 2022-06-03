import { sumBy } from 'lodash'
import {
  CalculatedMortgageProgram,
  MortgageEarlyPayoffPurpose,
  MortgageEarlyPayoffType,
  MortgageCourse,
  MortgageType,
} from './types'

export interface AmortizationScheduleTransaction {
  totalPayment: number
  principalPayment: number
  interestPayment: number
  principalBalanceInStartPeriond: number
}

function PMT(
  ir: number,
  np: number,
  pv: number,
  fv: number = 0,
  type: number = 0
) {
  /*
   * ir   - interest rate per month
   * np   - number of periods (months)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  var pmt, pvif

  fv || (fv = 0)
  type || (type = 0)

  if (ir === 0) return -(pv + fv) / np

  pvif = Math.pow(1 + ir, np)
  pmt = (-ir * (pv * pvif + fv)) / (pvif - 1)

  if (type === 1) pmt /= 1 + ir

  return pmt
}

function calcMonthPayment(mortgageProgramData: MortgageCourse) {
  const { interest, periodInMonths, amount } = mortgageProgramData
  return interest && periodInMonths && amount
    ? PMT(interest / (100 * 12), periodInMonths, amount) * -1
    : null
}

function calcMonthlyPaymentToShortenDuration(
  currentMonthlyPayment: number,
  updateProgramData: MortgageCourse
): Number {
  const { amount, interest } = updateProgramData

  const monthlyInterest = interest / (100 * 12)
  let currentPrincipalBalanceInStartPeriond = amount
  let currentMonth = 0
  let totalMortgagePayment = 0

  while (currentPrincipalBalanceInStartPeriond > 0) {
    const interestPayment =
      currentPrincipalBalanceInStartPeriond * monthlyInterest
    let principalPayment = Math.min(
      currentMonthlyPayment - interestPayment,
      currentPrincipalBalanceInStartPeriond
    )

    const totalMontlyPayment = interestPayment + principalPayment

    totalMortgagePayment += totalMontlyPayment
    currentPrincipalBalanceInStartPeriond -= principalPayment
    currentMonth++
  }

  return totalMortgagePayment / currentMonth
}

export function calcProgramAmortizationSchedule(
  programData: MortgageCourse
): AmortizationScheduleTransaction[] {
  const {
    amount,
    interest,
    periodInMonths,
    type,
    returnType,
    expectedCpiChange = 0,
  } = programData

  let currentPrincipalBalance = amount
  let principalBalanceInStartPeriond = amount
  const monthlyInterest = interest / (100 * 12)
  let monthlyCPIInterest =
    type === MortgageType.LINKED_FIXED
      ? (expectedCpiChange ?? 0) / (100 * 12)
      : 0

  let monthlyPayment = calcMonthPayment({ ...programData }) || 0
  const payments: AmortizationScheduleTransaction[] = []
  let currentMonth = 1

  while (currentPrincipalBalance > 0) {
    currentPrincipalBalance *= 1 + monthlyCPIInterest
    monthlyPayment *= 1 + monthlyCPIInterest
    let interestPayment = currentPrincipalBalance * monthlyInterest
    let principalPayment = monthlyPayment - interestPayment

    if (
      programData.earlyPayoffMonths === currentMonth &&
      !!programData.earlyPayoffType
    ) {
      if (programData.earlyPayoffType === MortgageEarlyPayoffType.COMPLETE) {
        principalPayment = currentPrincipalBalance
      } else {
        principalPayment = Math.min(
          principalPayment + programData.earlyPayoffAmount!,
          currentPrincipalBalance
        )
      }

      if (
        programData.earlyPayoffPurpose ===
        MortgageEarlyPayoffPurpose.REDUCING_PAYMENT
      ) {
        monthlyPayment =
          calcMonthPayment({
            id: '',
            amount: currentPrincipalBalance - principalPayment,
            interest,
            periodInMonths: periodInMonths - currentMonth,
            type,
            returnType,
          }) || 0
      }
    }

    const totalPayment = interestPayment + principalPayment

    payments.push({
      totalPayment,
      principalPayment,
      interestPayment,
      principalBalanceInStartPeriond,
    })
    currentPrincipalBalance = currentPrincipalBalance - principalPayment
    principalBalanceInStartPeriond = currentPrincipalBalance
    currentMonth++
  }

  return payments
}

export function calcAmortizationSchedule(
  programsData: MortgageCourse[]
): AmortizationScheduleTransaction[] {
  const amortizations = programsData.map((programData) =>
    calcProgramAmortizationSchedule(programData)
  )
  const largestAmortizationIndex = amortizations.reduce((res, cur) => {
    return cur.length > res ? cur.length : res
  }, 0)

  const fullAmortization = []
  for (let index = 0; index < largestAmortizationIndex; index++) {
    fullAmortization[index] = amortizations.reduce(
      (res, cur) => {
        return {
          interestPayment:
            res.interestPayment + (cur[index]?.interestPayment ?? 0),
          principalBalanceInStartPeriond:
            res.principalBalanceInStartPeriond +
            (cur[index]?.principalBalanceInStartPeriond ?? 0),
          principalPayment:
            res.principalPayment + (cur[index]?.principalPayment ?? 0),
          totalPayment: res.totalPayment + (cur[index]?.totalPayment ?? 0),
        }
      },
      {
        interestPayment: 0,
        principalBalanceInStartPeriond: 0,
        principalPayment: 0,
        totalPayment: 0,
      }
    )
  }

  return fullAmortization
}

export function amortizationPaymantsToBurndown(payments: number[]): number[] {
  const startAmount = payments.reduce((res, cur) => {
    return res + cur
  }, 0)

  let runningAmount = startAmount

  const burnDown = payments.map((payment, index, payments) => {
    runningAmount = runningAmount - payment
    return runningAmount
  })

  return [startAmount, ...burnDown, 0]
}

export function calcDisplayedMortgageProgram(
  programData: MortgageCourse
): CalculatedMortgageProgram {
  const payemnt = calcProgramAmortizationSchedule(programData)

  const displayEarlyPayoffAmount =
    programData.earlyPayoffType === MortgageEarlyPayoffType.COMPLETE
      ? payemnt[payemnt.length - 1].totalPayment
      : programData.earlyPayoffAmount

  return {
    ...programData,
    totalPayment: sumBy(payemnt, 'totalPayment'),
    totalInterestPayment: sumBy(payemnt, 'interestPayment'),
    monthlyPayment: payemnt[0]?.totalPayment ?? 0,
    earlyPayoffAmount: displayEarlyPayoffAmount,
  }
}
