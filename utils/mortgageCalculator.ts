import { maxBy, sumBy } from 'lodash'
import { calcAmortizationSchedule } from './amortizationScheduleCalculator'
import {
  MortgageProgramData,
  CalculatedMortgageSummery,
  MortgageType,
} from './types'

export function isMortgageCourseCpiLinked(programsData: MortgageProgramData) {
  return programsData.type === MortgageType.LINKED_FIXED
}

export function calcTotalSummery(
  mortgageCourses: MortgageProgramData[]
): CalculatedMortgageSummery {
  const totalAmortizationSchedule = calcAmortizationSchedule(mortgageCourses)
  const originalPrincipalPayment =
    totalAmortizationSchedule[0].principalBalanceInStartPeriond
  const totalPayment = sumBy(totalAmortizationSchedule, 'totalPayment') || 0

  return {
    originalPrincipalPayment,
    monthlyPayment: totalAmortizationSchedule[0].totalPayment,
    maxMonthlyPayment:
      maxBy(totalAmortizationSchedule, 'totalPayment')?.totalPayment || 0,
    cpiLinkPayment:
      sumBy(totalAmortizationSchedule, 'principalPayment') ||
      0 - originalPrincipalPayment,
    interestPayment: sumBy(totalAmortizationSchedule, 'interestPayment') || 0,
    totalPayment,
    currencyRatio: originalPrincipalPayment
      ? totalPayment / originalPrincipalPayment
      : 0,
  }
}
