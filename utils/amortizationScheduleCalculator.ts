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
) {
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
) {
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

export function calcAmortizationSchedule(programsData: MortgageProgramData[]) {}
