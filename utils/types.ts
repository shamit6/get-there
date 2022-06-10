import type {
  // User,
  Mortgage as MortgagePrisma,
  MortgageCourse as MortgageCoursePrisma,
} from '@prisma/client'
import {
  // MortgageType,
  // ReturnType,
  MortgageEarlyPayoffType,
  MortgageEarlyPayoffPurpose,
} from '@prisma/client'

export type {
  // BalanceStatus,
  User,
} from '@prisma/client'
export {
  Bank,
  MortgageType,
  ReturnType,
  MortgageEarlyPayoffType,
  MortgageEarlyPayoffPurpose,
} from '@prisma/client'

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

export interface MortgageCourse
  extends Omit<
    MortgageCoursePrisma,
    | 'userId'
    | 'mortgageId'
    | 'expectedCpiChange'
    | 'earlyPayoffType'
    | 'earlyPayoffMonths'
    | 'earlyPayoffAmount'
    | 'earlyPayoffPurpose'
    | 'userEmail'
  > {
  expectedCpiChange?: number | null
  earlyPayoffType?: MortgageEarlyPayoffType | null
  earlyPayoffMonths?: number | null
  earlyPayoffAmount?: number | null
  earlyPayoffPurpose?: MortgageEarlyPayoffPurpose | null
}

export interface Mortgage
  extends Omit<MortgagePrisma, 'userEmail' | 'id' | 'address'> {
  id?: string
  courses: MortgageCourse[]
  address?: string
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
