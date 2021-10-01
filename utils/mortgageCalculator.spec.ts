import { calcProgram } from './mortgageCalculator'
import { MortgageProgramData, CalculatedMortgageProgram } from './types'

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
    const program: MortgageProgramData = {
      amount: 125000,
      type: 'non-linked-fixed',
      returnType: '',
      periodInMonths: 180,
      interest: 3,
    }

    const result = calcProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 0,
      monthlyPayment: 863,
      totalPayment: 155381,
    })
  })

  it('non-linked-fixed, complete early payoff', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: 'non-linked-fixed',
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: 'complete',
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 0,
      earlyPayoffPurpose: '',
    }

    const result = calcProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 118026,
      monthlyPayment: 863,
      totalPayment: 129248,
    })
  })

  it('non-linked-fixed, paritial early payoff, reduce monthly payment', () => {
    const program: MortgageProgramData = {
      amount: 125000,
      type: 'non-linked-fixed',
      returnType: '',
      periodInMonths: 180,
      interest: 3,
      earlyPayoffType: 'partial',
      earlyPayoffMonths: 14,
      earlyPayoffAmount: 40000,
      earlyPayoffPurpose: '',
    }

    const result = calcProgram(program)
    expect(roundProgramCalcFields(result)).toEqual({
      earlyPayoffAmount: 40000,
      monthlyPayment: 863,
      totalPayment: 146459,
    })
  })
})
