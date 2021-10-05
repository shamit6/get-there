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

export enum MortgageType {
  NON_LINKED_FIXED = 'non-linked fixed',
  LINKED_FIXED = 'linked fixed',
}

export enum MortgageEarlyPayoffType {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
}

export enum MortgageEarlyPayoffPurpose {
  SHORTENING_DURATION = 'shortening-duration',
  REDUCINNG_PAYMENT = 'reducinng-payment',
}

export interface MortgageProgramData {
  amount: number
  type: MortgageType
  returnType?: string
  periodInMonths: number
  interest: number
  expectedCpiChange?: number
  earlyPayoffType?: MortgageEarlyPayoffType
  earlyPayoffMonths?: number
  earlyPayoffAmount?: number
  earlyPayoffPurpose?: MortgageEarlyPayoffPurpose
}

export interface CalculatedMortgageProgram extends MortgageProgramData {
  monthlyPayment: number
  totalInterestPayment: number
  totalPayment: number
}

export interface MortgageSummeryCalculation {
  monthlyPayment: number
  totalInterestPayment: number
  totalPayment: number
}
