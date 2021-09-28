import { sumBy } from 'lodash'
import {
  CalculatedMortgageProgram,
  MortgageProgramData,
  MortgageSummeryCalculation,
} from './types'
import BigNumber from 'bignumber.js'

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
  // pvif = new BigNumber(1 + ir).pow(np);
  // pmt = pvif.multipliedBy(pv).plus(fv).multipliedBy(-ir).dividedBy(pvif.minus(1))

  if (type === 1) pmt /= 1 + ir
  // if (type === 1)
  //     pmt = pmt.dividedBy(1+ir);

  return pmt
}

function calcMonthPayment(mortgageProgramData: MortgageProgramData) {
  const { interest, periodInMonths, amount } = mortgageProgramData
  return interest && periodInMonths && amount
    ? PMT(interest / (100 * 12), periodInMonths, amount) * -1
    : null
}

function calcEarlyPayoff(mortgageProgramData: MortgageProgramData) {
  const {
    interest,
    amount,
    periodInMonths,
    earlyPayoffMonths,
    earlyPayoffType,
    earlyPayoffAmount,
  } = mortgageProgramData

  if (earlyPayoffType === 'partial') {
    return earlyPayoffAmount
  }

  if (!earlyPayoffMonths) {
    return 0
  }
  const normlizedMonthlyInterest = interest / (12 * 100)

  const laonBalanceAfterXMonths = new BigNumber(amount)
    .multipliedBy(
      new BigNumber(normlizedMonthlyInterest + 1)
        .pow(periodInMonths)
        .minus(
          new BigNumber(normlizedMonthlyInterest + 1).pow(
            Math.trunc(earlyPayoffMonths)
          )
        )
    )
    .dividedBy(
      new BigNumber(normlizedMonthlyInterest + 1)
        .pow(Math.trunc(periodInMonths))
        .minus(1)
    )
    .toNumber()

  return laonBalanceAfterXMonths + (calcMonthPayment(mortgageProgramData) || 0)
}

function calcTotalPaymentNoEarlyPayoff(
  mortgageProgramData: MortgageProgramData
) {
  const monthlyPayment = calcMonthPayment(mortgageProgramData) || 0
  return monthlyPayment * mortgageProgramData.periodInMonths
}

function calcTotalPayment(mortgageProgramData: MortgageProgramData): number {
  const { periodInMonths, type, earlyPayoffMonths, returnType, interest } =
    mortgageProgramData
  const earlyPayoff = calcEarlyPayoff(mortgageProgramData)
  const tatolPaymentNoEarlyPayoff =
    calcTotalPaymentNoEarlyPayoff(mortgageProgramData)

  if (!earlyPayoff) {
    return tatolPaymentNoEarlyPayoff
  }

  const theoreticMortgage = {
    ...mortgageProgramData,
    amount: earlyPayoff,
    periodInMonths: periodInMonths - earlyPayoffMonths!,
  }
  const theoreticTotalInterest =
    calcTotalPaymentNoEarlyPayoff(theoreticMortgage) - earlyPayoff

  return tatolPaymentNoEarlyPayoff - theoreticTotalInterest
}

export function calcProgram(
  mortgageProgramData: MortgageProgramData
): CalculatedMortgageProgram {
  const monthlyPayment = calcMonthPayment(mortgageProgramData) || 0

  return {
    ...mortgageProgramData,
    monthlyPayment,
    totalPayment: calcTotalPayment(mortgageProgramData),
    earlyPayoffAmount: calcEarlyPayoff(mortgageProgramData),
  }
}

export function calcTotalSummery(
  programsData: MortgageProgramData[]
): MortgageSummeryCalculation {
  const totalPayment = sumBy(programsData, 'totalPayment')
  const totalLoanAmount = sumBy(programsData, 'amount')
  return {
    monthlyPayment: sumBy(programsData, 'monthlyPayment') || 0,
    totalInterestPayment: totalPayment - totalLoanAmount,
    totalPayment: totalPayment,
  }
}
