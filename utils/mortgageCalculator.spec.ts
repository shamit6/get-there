import { calcTotalSummery } from './mortgageCalculator'
import { MortgageType } from './types'
import { numberValuesToFixed } from './testUtils'

describe('Mortage Calculator', () => {
  it('calcTotalSummery', () => {
    const mortage = [
      {
        amount: 500000,
        type: MortgageType.LINKED_FIXED,
        returnType: '',
        periodInMonths: 180,
        interest: 3,
        expectedCpiChange: 2,
      },
      {
        amount: 200000,
        type: MortgageType.NON_LINKED_FIXED,
        returnType: '',
        periodInMonths: 240,
        interest: 3,
      },
    ]

    const roundedResult = numberValuesToFixed(calcTotalSummery(mortage), 2)

    expect(roundedResult).toEqual({
      originalPrincipalPayment: 700000,
      monthlyPayment: 4567.86,
      maxMonthlyPayment: 5768.97,
      interestPayment: 201492.97,
      cpiLinkPayment: 790040.68,
      totalPayment: 991533.64,
      currencyRatio: 1.42,
    })
  })
})
