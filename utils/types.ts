export enum TimePeriod {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year"
}

export interface TransactionnInetrval {
  timePeriod: TimePeriod;
  amount: number;
  endDate?: Date;
}

export interface TransactionConfig {
  id?: string;
  type: string;
  date: Date;
  amount: number;
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

