import { MortgageProgramData } from './types'

export function PMT(
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

export function calcMonthPayment(
  mortgageProgramData: Partial<MortgageProgramData>
) {
  const { interest, periodInMonths, amount } = mortgageProgramData
  return interest && periodInMonths && amount
    ? PMT(interest / (100 * 12), periodInMonths, amount) * -1
    : null
}
