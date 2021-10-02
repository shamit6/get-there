import { calcMonthPayment } from './mortgageCalculator'
import {
  MortgageEarlyPayoffPurpose,
  MortgageEarlyPayoffType,
  MortgageProgramData,
} from './types'

export interface AmortizationScheduleTransaction {
  totalPayment: number
  principalPayment: number
  interestPayment: number
  principalBalanceInStartPeriond: number
}

function calcMonthlyPaymentToShortenDuration(
  currentMonthlyPayment: number,
  updateProgramData: MortgageProgramData
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
  programData: MortgageProgramData
): AmortizationScheduleTransaction[] {
  const { amount, interest, periodInMonths, returnType } = programData

  let currentPrincipalBalanceInStartPeriond = amount
  const monthlyInterest = interest / (100 * 12)
  let monthlyPayment = calcMonthPayment(programData) || 0
  const payments: AmortizationScheduleTransaction[] = []
  let currentMonth = 1

  while (currentPrincipalBalanceInStartPeriond > 0) {
    const interestPayment =
      currentPrincipalBalanceInStartPeriond * monthlyInterest
    let principalPayment = monthlyPayment - interestPayment

    if (
      programData.earlyPayoffMonths === currentMonth &&
      !!programData.earlyPayoffType
    ) {
      if (programData.earlyPayoffType === MortgageEarlyPayoffType.COMPLETE) {
        principalPayment = currentPrincipalBalanceInStartPeriond
      } else {
        principalPayment = Math.min(
          principalPayment + programData.earlyPayoffAmount!,
          currentPrincipalBalanceInStartPeriond
        )
      }

      if (
        programData.earlyPayoffPurpose ===
        MortgageEarlyPayoffPurpose.REDUCINNG_PAYMENT
      ) {
        monthlyPayment =
          calcMonthPayment({
            amount: currentPrincipalBalanceInStartPeriond - principalPayment,
            interest,
            periodInMonths: periodInMonths - currentMonth,
            returnType,
          }) || 0
      }
      // else {
      //   monthlyPayment = calcMonthlyPaymentToShortenDuration(monthlyPayment, {
      //     amount: currentPrincipalBalanceInStartPeriond - principalPayment,
      //     interest,
      //     periodInMonths: periodInMonths - currentMonth,
      //     returnType,
      //   })
      //   console.log('monthlyPayment', monthlyPayment);

      // }
    }

    const totalPayment = interestPayment + principalPayment

    payments.push({
      totalPayment,
      principalPayment,
      interestPayment,
      principalBalanceInStartPeriond: currentPrincipalBalanceInStartPeriond,
    })

    currentPrincipalBalanceInStartPeriond -= principalPayment
    currentMonth++
  }

  return payments
}

export function calcAmortizationSchedule(
  programsData: MortgageProgramData[]
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
            res.interestPayment + cur[index]?.interestPayment ?? 0,
          principalBalanceInStartPeriond:
            res.principalBalanceInStartPeriond +
              cur[index]?.principalBalanceInStartPeriond ?? 0,
          principalPayment: res.principalPayment + cur[index].principalPayment,
          totalPayment: res.totalPayment + cur[index]?.totalPayment ?? 0,
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
