export enum TimePeriod {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year"
}

export interface TransactionnInetrval {
  timePeriod: TimePeriod;
  amount: number;
}

export interface TransactionConfig {
  type: string;
  date: Date;
  amount: number;
  endDate?: Date;
  interval?: TransactionnInetrval;
}

export interface Transaction {
  type: string;
  date: Date;
  amount: number;
}

export interface BalanceStatus {
  updatedDate: Date;
  amount: number;
}

