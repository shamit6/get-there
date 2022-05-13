import {
  AmortizationScheduleTransaction,
  calcDisplayedMortgageProgram,
  calcProgramAmortizationSchedule,
} from './amortizationScheduleCalculator'
import {
  MortgageCourse,
  MortgageEarlyPayoffType,
  MortgageType,
  MortgageEarlyPayoffPurpose,
  CalculatedMortgageProgram,
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
    const program: MortgageCourse = {
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
    const program: MortgageCourse = {
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
    const program: MortgageCourse = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.PARTIAL,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 30000,
      earlyPayoffPurpose: MortgageEarlyPayoffPurpose.REDUCING_PAYMENT,
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
    const program: MortgageCourse = {
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
    expect(result.length).toEqual(131)
  })

  it('linked-fixed, no early payoff', () => {
    const program: MortgageCourse = {
      amount: 500000,
      type: MortgageType.LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      expectedCpiChange: 2,
    }

    const result = calcProgramAmortizationSchedule(program)
    const firstRow = roundScheduleTransaction(result[0])
    const sampleRow = roundScheduleTransaction(result[99])
    const lastRow = roundScheduleTransaction(result[result.length - 1])

    expect(firstRow).toEqual({
      totalPayment: 3459,
      principalPayment: 2207,
      interestPayment: 1252,
      principalBalanceInStartPeriond: 500000,
    })
    expect(sampleRow).toEqual({
      totalPayment: 4079,
      principalPayment: 3332,
      interestPayment: 747,
      principalBalanceInStartPeriond: 298229,
    })
    expect(lastRow).toEqual({
      totalPayment: 4660,
      principalPayment: 4648,
      interestPayment: 12,
      principalBalanceInStartPeriond: 4640,
    })
  })

  it('linked-fixed, complete early payoff', () => {
    const program: MortgageCourse = {
      amount: 500000,
      type: MortgageType.LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      expectedCpiChange: 2,
      earlyPayoffType: MortgageEarlyPayoffType.COMPLETE,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 0,
    }

    const result = calcProgramAmortizationSchedule(program)
    const firstRow = roundScheduleTransaction(result[0])
    const lastRow = roundScheduleTransaction(result[result.length - 1])

    expect(firstRow).toEqual({
      totalPayment: 3459,
      principalPayment: 2207,
      interestPayment: 1252,
      principalBalanceInStartPeriond: 500000,
    })
    expect(lastRow).toEqual({
      totalPayment: 483242,
      principalPayment: 482037,
      interestPayment: 1205,
      principalBalanceInStartPeriond: 481235,
    })
  })

  it('linked-fixed, partial early payoff, reducing payment', () => {
    const program: MortgageCourse = {
      amount: 500000,
      type: MortgageType.LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      expectedCpiChange: 2,
      earlyPayoffType: MortgageEarlyPayoffType.COMPLETE,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 0,
    }

    const result = calcProgramAmortizationSchedule(program)
    const firstRow = roundScheduleTransaction(result[0])
    const lastRow = roundScheduleTransaction(result[result.length - 1])

    expect(firstRow).toEqual({
      totalPayment: 3459,
      principalPayment: 2207,
      interestPayment: 1252,
      principalBalanceInStartPeriond: 500000,
    })
    expect(lastRow).toEqual({
      totalPayment: 483242,
      principalPayment: 482037,
      interestPayment: 1205,
      principalBalanceInStartPeriond: 481235,
    })
  })
})

function roundProgramCalcFields(program: CalculatedMortgageProgram) {
  const { earlyPayoffAmount, monthlyPayment, totalPayment } = program
  return {
    earlyPayoffAmount: Math.round(earlyPayoffAmount || 0),
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
  }
}

describe('mortgage calculator', () => {
  it('non-linked-fixed, no early payoff', () => {
    const program: MortgageCourse = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
    }

    const result = calcDisplayedMortgageProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 0,
      monthlyPayment: 863,
      totalPayment: 155381,
    })
  })

  it('non-linked-fixed, complete early payoff', () => {
    const program: MortgageCourse = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.COMPLETE,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 0,
    }

    const result = calcDisplayedMortgageProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 118026,
      monthlyPayment: 863,
      totalPayment: 129248,
    })
  })

  it('non-linked-fixed, paritial early payoff, reduce monthly payment', () => {
    const program: MortgageCourse = {
      amount: 125000,
      type: MortgageType.NON_LINKED_FIXED,
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: MortgageEarlyPayoffType.PARTIAL,
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 40000,
      earlyPayoffPurpose: MortgageEarlyPayoffPurpose.REDUCING_PAYMENT,
    }

    const result = calcDisplayedMortgageProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 40000,
      monthlyPayment: 863,
      totalPayment: 146459,
    })
  })
})
