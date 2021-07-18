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
  id?: number;
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
export interface TimelineTransaction extends Transaction{
  balance?: number;
}
export interface BalanceStatus {
  createdAt: Date;
  amount: number;
}

