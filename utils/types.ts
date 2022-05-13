export enum TimePeriod {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface TransactionInterval {
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
  REDUCING_PAYMENT = 'reducing-payment',
}

export type ReturnType = 'Spitzer' | 'Bullet' | 'CPM'

export interface MortgageCourse {
  amount: number
  type: MortgageType
  returnType: ReturnType
  periodInMonths: number
  interest: number
  expectedCpiChange?: number
  earlyPayoffType?: MortgageEarlyPayoffType
  earlyPayoffMonths?: number
  earlyPayoffAmount?: number
  earlyPayoffPurpose?: MortgageEarlyPayoffPurpose
}

export interface CalculatedMortgageProgram extends MortgageCourse {
  monthlyPayment: number
  totalInterestPayment: number
  totalPayment: number
}

export interface CalculatedMortgageSummery {
  originalPrincipalPayment: number
  monthlyPayment: number
  maxMonthlyPayment: number
  cpiLinkPayment: number
  interestPayment: number
  totalPayment: number
  currencyRatio: number
}

export enum Bank {
  POALIM = 'POALIM',
  DISCOUNT = 'DISCOUNT',
  LEUMI = 'LEUMI',
  MIZRAHI = 'MIZRAHI',
  YAHAV = 'YAHAV',
  JERUSALEM = 'JERUSALEM',
}

export interface Mortgage {
  fundingRate: number
  bank: Bank
  income: number
  userEmail: string
  courses: MortgageCourse[]
  offeringDate: Date
  marketValue: number
  adderss?: string
}
