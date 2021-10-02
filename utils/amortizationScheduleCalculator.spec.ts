import {
  AmortizationScheduleTransaction,
  calcProgramAmortizationSchedule,
} from './amortizationScheduleCalculator'
import {
  MortgageProgramData,
  CalculatedMortgageProgram,
  MortgageEarlyPayoffType,
  MortgageType,
  MortgageEarlyPayoffPurpose,
} from './types'

function roundScheduleTransaction(
  transaction: AmortizationScheduleTransaction
): AmortizationScheduleTransaction {
  const entriesArray = Object.entries(transaction).map(([key, value]) => ({
    [key]: Math.round(value),
  }))
  // @ts-ignore
  return entriesArray.reduce((fields, curr) => ({ ...fields, ...curr }), {})
}

describe('Amortization Schedule Calculator', () => {
  it('non-linked-fixed, no early payoff', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
    }

    const result = calcProgramAmortizationSchedule(program)
    const sampleRow = roundScheduleTransaction(result[99])
    const lastRow = roundScheduleTransaction(result[result.length - 1])
    expect(sampleRow).toEqual({
      totalPayment: 863,
      principalPayment: 705,
      interestPayment: 158,
      principalBalanceInStartPeriond: 63225,
    })
    expect(lastRow).toEqual({
      totalPayment: 863,
      principalPayment: 861,
      interestPayment: 2,
      principalBalanceInStartPeriond: 861,
    })
  })

  it('non-linked-fixed, complete early payoff', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.COMPLETE,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 0,
    }

    const result = calcProgramAmortizationSchedule(program)

    const sampleRow = roundScheduleTransaction(result[10])
    const lastRow = roundScheduleTransaction(result[result.length - 1])
    expect(sampleRow).toEqual({
      totalPayment: 863,
      principalPayment: 565,
      interestPayment: 299,
      principalBalanceInStartPeriond: 119430,
    })
    expect(lastRow).toEqual({
      totalPayment: 118026,
      principalPayment: 117732,
      interestPayment: 294,
      principalBalanceInStartPeriond: 117732,
    })
  })

  it('non-linked-fixed, partial early payoff, reducing payment', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.PARTIAL,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 30000,
      earlyPayoffPurpose: MortgageEarlyPayoffPurpose.REDUCINNG_PAYMENT,
    }

    const result = calcProgramAmortizationSchedule(program)

    const sampleRow = roundScheduleTransaction(result[10])
    const earlyPayoffRow = roundScheduleTransaction(result[13])
    const lastRow = roundScheduleTransaction(result[result.length - 1])
    expect(sampleRow).toEqual({
      totalPayment: 863,
      principalPayment: 565,
      interestPayment: 299,
      principalBalanceInStartPeriond: 119430,
    })
    expect(earlyPayoffRow).toEqual({
      totalPayment: 30863,
      principalPayment: 30569,
      interestPayment: 294,
      principalBalanceInStartPeriond: 117732,
    })
    expect(lastRow).toEqual({
      totalPayment: 642,
      principalPayment: 641,
      interestPayment: 2,
      principalBalanceInStartPeriond: 641,
    })
  })

  it('non-linked-fixed, partial early payoff, shortening duration', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.PARTIAL,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 30000,
      earlyPayoffPurpose: MortgageEarlyPayoffPurpose.SHORTENING_DURATION,
    }

    const result = calcProgramAmortizationSchedule(program)
    const sampleRow = roundScheduleTransaction(result[10])
    const earlyPayoffRow = roundScheduleTransaction(result[13])
    // const lastRow = roundScheduleTransaction(result[result.length-1])

    expect(sampleRow).toEqual({
      totalPayment: 863,
      principalPayment: 565,
      interestPayment: 299,
      principalBalanceInStartPeriond: 119430,
    })
    expect(earlyPayoffRow).toEqual({
      totalPayment: 30863,
      principalPayment: 30569,
      interestPayment: 294,
      principalBalanceInStartPeriond: 117732,
    })
    // expect(lastRow).toEqual({
    //   totalPayment: 860,
    //   principalPayment: 858,
    //   interestPayment: 1,
    //   principalBalanceInStartPeriond: 858,
    // })
    expect(result.length).toEqual(131)
  })
})
