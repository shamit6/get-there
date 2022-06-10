import { maxBy, sumBy } from 'lodash'
import { calcAmortizationSchedule } from './amortizationScheduleCalculator'
import type {
  MortgageCourse,
  CalculatedMortgageSummery,
  Mortgage,
} from './types'
import { ObjectId } from 'bson'

export function isMortgageCourseCpiLinked(programsData: MortgageCourse) {
  return programsData.type === 'LINKED_FIXED'
}

export function calcTotalSummery(
  mortgageCourses: MortgageCourse[]
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

export function generateNewMortageCourse(): MortgageCourse {
  return {
    id: new ObjectId().toJSON(),
    amount: 100000,
    type: 'NON_LINKED_FIXED',
    returnType: 'Shpitzer',
    periodInMonths: 240,
    interest: 3,
  }
}

export function generateNewMortage(): Partial<Mortgage> {
  return {
    courses: [
      generateNewMortageCourse(),
      generateNewMortageCourse(),
      generateNewMortageCourse(),
    ],
  }
}
