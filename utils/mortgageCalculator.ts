import { sumBy } from 'lodash'
import {
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

export function calcMonthPayment(mortgageProgramData: MortgageProgramData) {
  const { interest, periodInMonths, amount } = mortgageProgramData
  return interest && periodInMonths && amount
    ? PMT(interest / (100 * 12), periodInMonths, amount) * -1
    : null
}

function calcBalanceAfterEarlyPayoff(mortgageProgramData: MortgageProgramData) {
  const {
    interest,
    amount,
    periodInMonths,
    earlyPayoffMonths,
    earlyPayoffType,
    earlyPayoffAmount = 0,
  } = mortgageProgramData

  if (!earlyPayoffMonths) {
    return amount
  }

  const earlyPayoffAmountToReduce =
    earlyPayoffType === 'partial' ? earlyPayoffAmount : 0
  const normlizedMonthlyInterest = interest / (12 * 100)

  return (
    new BigNumber(amount)
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
      .toNumber() - earlyPayoffAmountToReduce
  )
}

export function calcEarlyPayoff(mortgageProgramData: MortgageProgramData) {
  const { earlyPayoffMonths, earlyPayoffType, earlyPayoffAmount } =
    mortgageProgramData

  if (earlyPayoffType === 'partial') {
    return earlyPayoffAmount || 0
  }

  if (!earlyPayoffMonths || !earlyPayoffType) {
    return 0
  }

  return calcBalanceAfterEarlyPayoff(mortgageProgramData)
}

function calcEarlyPayoffToView(mortgageProgramData: MortgageProgramData) {
  const { earlyPayoffMonths, earlyPayoffType, earlyPayoffAmount } =
    mortgageProgramData

  if (earlyPayoffType === 'partial') {
    return earlyPayoffAmount || 0
  }

  if (!earlyPayoffMonths || !earlyPayoffType) {
    return 0
  }

  return (
    calcEarlyPayoff(mortgageProgramData) +
    (calcMonthPayment(mortgageProgramData) || 0)
  )
}

function calcTotalPaymentNoEarlyPayoff(
  mortgageProgramData: MortgageProgramData
) {
  const monthlyPayment = calcMonthPayment(mortgageProgramData) || 0
  return monthlyPayment * mortgageProgramData.periodInMonths
}

function calcTotalPaymentUntillAfterEarlyPayoff(
  mortgageProgramData: MortgageProgramData
) {
  const monthPayment = calcMonthPayment(mortgageProgramData) || 0
  const { earlyPayoffMonths = 0 } = mortgageProgramData
  return monthPayment * earlyPayoffMonths + calcEarlyPayoff(mortgageProgramData)
}

function calcTotalPayment(mortgageProgramData: MortgageProgramData): number {
  const { periodInMonths, earlyPayoffMonths, earlyPayoffType } =
    mortgageProgramData
  const tatolPaymentNoEarlyPayoff =
    calcTotalPaymentNoEarlyPayoff(mortgageProgramData)

  if (!earlyPayoffMonths || !earlyPayoffType) {
    return tatolPaymentNoEarlyPayoff
  }

  if (earlyPayoffType === 'complete') {
    return calcTotalPaymentUntillAfterEarlyPayoff(mortgageProgramData)
    //earlyPayoffType === "partial"
  } else {
    const amountAfterEarlyPayoff =
      calcBalanceAfterEarlyPayoff(mortgageProgramData)

    const theoreticMortgage = {
      ...mortgageProgramData,
      amount: amountAfterEarlyPayoff,
      periodInMonths: periodInMonths - earlyPayoffMonths!,
    }

    return (
      calcTotalPaymentUntillAfterEarlyPayoff(mortgageProgramData) +
      calcTotalPaymentNoEarlyPayoff(theoreticMortgage)
    )
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
