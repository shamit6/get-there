export enum TimePeriod {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface TransactionnInetrval {
  timePeriod: TimePeriod
  amount: number
  endDate?: Date
}

export interface TransactionConfig {
  id?: string
  type: string
  date: Date
  amount: number
  timePeriod?: TimePeriod
  periodAmount?: number
  endDate?: Date
}

export interface Transaction {
  type: string
  date: Date
  amount: number
}
export interface TimelineTransaction extends Transaction {
  balance?: number
}
export interface BalanceStatus {
  createdAt: Date
  amount: number
}

export interface MortgageProgramData {
  amount: number
  type: string
  returnType: string
  periodInMonths: number
  interest: number
  earlyPayoffType?: string
  earlyPayoffMonths?: number
  earlyPayoffAmount?: number
  earlyPayoffPurpose?: string
}

export interface CalculatedMortgageProgram extends MortgageProgramData {
  monthlyPayment: number
  totalPayment: number
}

export interface MortgageSummeryCalculation {
  monthlyPayment: number
  totalInterestPayment: number
  totalPayment: number
}
