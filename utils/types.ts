// import {
//   Mortgage as MortgagePrisma,
//   MortgageCourse as MortgageCoursePrisma,
//   MortgageEarlyPayoffPurpose,
//   MortgageEarlyPayoffType,
// } from 'utils/prisma'

// export {
//   ReturnType,
//   MortgageEarlyPayoffType,
//   MortgageType,
//   MortgageEarlyPayoffPurpose,
// } from 'utils/prisma'

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
  // TransactionConfig,
  // Mortgage,
  // MortgageCourse,
} from '@prisma/client'
export {
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

export enum MortgageTypeEnum {
  NON_LINKED_FIXED = 'non-linked fixed',
  LINKED_FIXED = 'linked fixed',
}

export enum MortgageEarlyPayoffTypeEnum {
  COMPLETE = 'complete',
  PARTIAL = 'partial',
}

export enum MortgageEarlyPayoffPurposeEnum {
  SHORTENING_DURATION = 'shortening-duration',
  REDUCING_PAYMENT = 'reducing-payment',
}

// export type ReturnType = 'Spitzer' | 'Bullet' | 'CPM'

// export interface MortgageCourse {
//   amount: number
//   type: MortgageType
//   returnType: ReturnType
//   periodInMonths: number
//   interest: number
//   expectedCpiChange?: number
//   earlyPayoffType?: MortgageEarlyPayoffType
//   earlyPayoffMonths?: number
//   earlyPayoffAmount?: number
//   earlyPayoffPurpose?: MortgageEarlyPayoffPurpose
// }

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
  > {
  expectedCpiChange?: number
  earlyPayoffType?: MortgageEarlyPayoffType
  earlyPayoffMonths?: number
  earlyPayoffAmount?: number
  earlyPayoffPurpose?: MortgageEarlyPayoffPurpose
}

export interface Mortgage extends Omit<MortgagePrisma, 'userEmail' | 'id'> {
  id: string
  courses: MortgageCourse[]
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
